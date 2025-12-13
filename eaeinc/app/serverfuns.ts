/* ACTIONS FOR PAGES TO USE */
/*
    DEVELOPER'S NOTE:
    This page contains within all actions that can or should be used by the various pages
    for this project. This is done for the ease of calling and for the sanity of any future
    development and fixing. Each function will be explained below through comments, though
    any questions should be researched in the technical document.
*/
"use server";
import type { Post } from "@/app/components/homepage/PostForum";
import type { User } from "./components/homepage/userinformation/UserInformation";
import type { Upload } from "./components/consortium/InstrumentConsortium";
import { db } from "@/app/database";
import { NextResponse } from "next/server";

/* TEMPORARY INTERFACES */
interface UserFull {
  name: string;
  email: string;
  picture: string;
  department: string;
  bio: string;
  currentContributionScore?: number;
  highestContributionScore?: number;
  isAdmin: boolean;
}

interface Instruments {
  id: number;
  title: string;
  description: string;
  emailID: string;
  upload: number;
  filePath: string;
  tags?: string[];
}

interface Comments {
  commentID: number;
  forumID: number;
  emailID: string;
  body: string;
}
/* USER INFO FETCHING */

/* FETCHINFOSMALL */
/*  Function used to retrieve basic user information
    based on their email address for the mini profile.  */
export async function fetchInfoSmall(email: string) {
  try {
    const [rows] = await db.execute(
      "SELECT userName, pictureURL FROM UserInfo WHERE emailID = ?",
      [email]
    );

    if ((rows as any[]).length === 0) {
      console.log("No user found for:", email);
      return {
        name: "Unknown User",
        picture: "",
        email,
      };
    }

    const row = (rows as any[])[0];
    const user: User = {
      name: row.userName || "Unknown User",
      picture: row.pictureURL || "",
      email,
    };
    return user;
  } catch (err: any) {
    console.error("Error in fetchInfoSmall:", err);
    return {
      name: "Error",
      picture: "",
      email,
    };
  }
}

/* FETCHINFOFULL */
/*  Function used to retrieve full user information
    based on their email address for the profile page.  */
export async function fetchInfoFull(email: string) {
  try {
    const [rows] = await db.execute(
      "SELECT userName, department, currentContributionScore, highestContributionScore, isAdmin, pictureURL, bio FROM UserInfo WHERE emailID = ?",
      [email]
    );

    if ((rows as any[]).length === 0) {
      console.log("No full info found for:", email);
      return {
        name: "Currently Empty",
        picture: "",
        bio: "No Bio Set",
        email,
        department: "Currently Empty",
        currentContributionScore: 0,
        highestContributionScore: 0,
        isAdmin: false,
      };
    }

    const row = (rows as any[])[0];
    const user: UserFull = {
      name: row.userName || "Currently Empty",
      picture: row.pictureURL || "",
      bio: row.bio || "No Bio Set",
      email,
      department: row.department || "Currently Empty",
      currentContributionScore: row.currentContributionScore || 0,
      highestContributionScore: row.highestContributionScore || 0,
      isAdmin: row.isAdmin || false,
    };
    return user;
  } catch (err: any) {
    console.error("Error in fetchInfoFull:", err);
    return {
      name: "Error",
      picture: "",
      bio: "Error",
      email,
      department: "Error",
      currentContributionScore: 0,
      highestContributionScore: 0,
      isAdmin: false,
    };
  }
}

/* INITIALUSERINFO */
/*  Function used to add initial user information
    to the database when they first log in.  */
export async function initialUserInfo(
  name: string,
  email: string,
  picture: string | null,
  admin: boolean
) {
  console.log("initialUserInfo called with:", { name, email, picture, admin });

  try {
    const [rows] = await db.execute(
      "SELECT userName, pictureURL FROM UserInfo WHERE emailID = ?",
      [email]
    );
    const existing = (rows as any[]).length > 0 ? (rows as any[])[0] : null;

    if (!existing) {
      console.log("No existing user, inserting new:", email);

      // ✅ Use Google image if provided, otherwise fallback
      const finalPicture =
        picture && picture.trim() !== "" ? picture : "/default-avatar.png";

      await db.execute(
        `INSERT INTO UserInfo 
          (userName, emailID, pictureURL, bio, department, currentContributionScore, highestContributionScore, isAdmin) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          email,
          finalPicture,
          "Not Specified",
          "Not Specified",
          0,
          0,
          admin,
        ]
      );
      console.log("Inserted new user:", email);
    } else {
      console.log("Existing user found:", existing);

      const needsUpdate =
        existing.userName === "New User" ||
        !existing.pictureURL ||
        existing.pictureURL.trim() === "";

      if (needsUpdate) {
        console.log("Updating existing user:", email);

        const finalPicture =
          picture && picture.trim() !== "" ? picture : "/default-avatar.png";

        await db.execute(
          "UPDATE UserInfo SET userName = ?, pictureURL = ? WHERE emailID = ?",
          [name, finalPicture, email]
        );
        console.log("Updated existing user:", email);
      }
    }
  } catch (err: any) {
    console.error("Error in initialUserInfo:", err);
  }
}

/* UPDATEUSERINFO */
/*  Function used to update user information for profile page
    in the database based on the information provided.  */
export async function updateUserInfo(fData: FormData) {
  // STEP 1: Extract data from FormData
  const name = fData.get("name") as string;
  const department = fData.get("department") as string;
  const email = fData.get("email") as string;
  const bio = fData.get("bio") as string;
  const picture = fData.get("picture") as string;

  // STEP 2: Update database with new information
  try {
    await db.execute(
      "UPDATE UserInfo SET userName = ?, department = ?, pictureURL = ?, bio = ? WHERE emailID = ?",
      [name, department, picture, bio, email]
    );
  } catch (err: any) {
    // Usual error catching.
    console.error(err);
  }
}

/* UPDATECONTRIBUTIONSCORE */
/*  Function used to update a user's contribution
    score in the database based on their email.    */
export async function updateContributionScore(email: string, score: number) {
  try {
    //STEP 1: Update database with new contribution score.
    await db.execute(
      "UPDATE UserInfo SET currentContributionScore = currentContributionScore + ? WHERE emailID = ?",
      [score, email]
    );
  } catch (err: any) {
    // Usual error catching.
    console.error(err);
  }
}

/* SENDCOMMENT */
/*  Function used to send data from a comment
    and then update the list of comments for a post.    */
export async function sendComment(fData: FormData) {
  // STEP 1: Extract data from comment object
  const forumID = fData.get("forumID");
  const body = fData.get("body") as string;
  const emailID = fData.get("emailID") as string;

  // STEP 2: Send data to backend
  try {
    //Try to send to database the new comment.
    await db.execute(
      "INSERT INTO ForumComment (forumID, emailID, body) VALUES (?, ?, ?)", //All manually filled information for a comment.
      [forumID, emailID, body] //The values to insert into the database.
    );
  } catch (err: any) {
    // Usual error catching.
    console.error(err);
  }
}

/* FETCHPOSTS */
/*  Function used to retrieve the first 50 posts 
    from the database to be displayed in the forum. */
/* FORUM POSTS */
export async function sendPost(post: Post) {
  try {
    const [result] = await db.execute(
      `INSERT INTO Forum (body, emailID, imageURL, likeCount) 
       VALUES (?, ?, ?, ?)`,
      [post.text, post.user.email, post.image, 0]
    );

    const insertedId = (result as any).insertId;

    // Return a fully shaped Post object
    return {
      id: insertedId,
      text: post.text,
      image: post.image,
      likes: 0,
      likedByUser: false, // new posts start unliked
      user: post.user,
      comments: [], // no comments yet
    };
  } catch (err) {
    console.error("sendPost error:", err);
    return null;
  }
}

/* FETCHPOSTS */
export async function fetchPosts(currentUserEmail: string) {
  try {
    const [rows] = await db.execute(`
      SELECT 
        f.forumID,
        f.body,
        f.imageURL,
        f.likeCount,
        f.emailID,
        u.userName,
        u.pictureURL
      FROM Forum f
      JOIN UserInfo u ON u.emailID = f.emailID
      WHERE f.isDeleted = 0
      ORDER BY f.uploadedAt DESC
    `);

    const posts = await Promise.all(
      (rows as any[]).map(async (row) => {
        // Check if this user liked the post
        const [likeRes] = await db.execute(
          `SELECT 1 FROM ForumLikes WHERE forumID = ? AND emailID = ? LIMIT 1`,
          [row.forumID, currentUserEmail]
        );
        const userLiked = (likeRes as any[]).length > 0;

        // Fetch comments
        const [comments] = await db.execute(
          `SELECT commentID, body, emailID 
           FROM ForumComment 
           WHERE forumID = ? AND isDeleted = 0`,
          [row.forumID]
        );

        return {
          id: row.forumID,
          text: row.body,
          image: row.imageURL || null,
          likes: row.likeCount,
          likedByUser: userLiked,
          user: {
            firstName: row.userName.split(" ")[0] || "Unknown",
            lastName: row.userName.split(" ")[1] || "User",
            email: row.emailID,
            imageUrl: row.pictureURL || "",
          },
          comments: (comments as any[]).map((c) => ({
            id: c.commentID,
            text: c.body,
            userEmail: c.emailID,
          })),
        };
      })
    );

    return posts;
  } catch (err) {
    console.error("fetchPosts error:", err);
    return [];
  }
}

/* FETCHCOMMENTS */
/*  Function used to retrieve all comments 
    for a specific post from the database. */
export async function fetchComments(forumID: number) {
  const [rows] = await db.execute(
    `
    SELECT ForumComment.commentID, ForumComment.forumID, ForumComment.emailID, ForumComment.body,
           UserInfo.userName, UserInfo.pictureURL
    FROM ForumComment
    JOIN UserInfo ON ForumComment.emailID = UserInfo.emailID
    WHERE ForumComment.forumID = ? AND ForumComment.isDeleted = FALSE
    ORDER BY ForumComment.commentID ASC
  `,
    [forumID]
  );

  const comments: Comments[] = (rows as any[]).map((row) => ({
    commentID: row.commentID,
    forumID: row.forumID,
    emailID: row.emailID,
    body: row.body,
    // extra fields for display
    userName: row.userName,
    pictureURL: row.pictureURL,
  }));

  return comments;
}

/* FETCHNEXT */
/*  Function used to retrieve the next 50 posts
    from the database to be displayed in the forum. */
/* FETCHNEXT */
export async function fetchNext(lastPostID: number, currentUserEmail: string) {
  const [rows] = await db.execute(
    `
    SELECT Forum.forumID, Forum.body, Forum.imageURL, Forum.likeCount,
           UserInfo.userName, UserInfo.pictureURL, UserInfo.emailID
    FROM Forum
    JOIN UserInfo ON Forum.emailID = UserInfo.emailID
    WHERE Forum.forumID < ? AND Forum.isDeleted = FALSE
    ORDER BY Forum.forumID DESC
    LIMIT 50
  `,
    [lastPostID]
  );

  const posts: Post[] = await Promise.all(
    (rows as any[]).map(async (row) => {
      const [likeRes] = await db.execute(
        `SELECT 1 FROM ForumLikes WHERE forumID = ? AND emailID = ? LIMIT 1`,
        [row.forumID, currentUserEmail]
      );
      const userLiked = (likeRes as any[]).length > 0;

      return {
        id: row.forumID,
        text: row.body,
        image: row.imageURL || null,
        likes: row.likeCount,
        likedByUser: userLiked,
        user: {
          firstName: row.userName.split(" ")[0] || "Unknown",
          lastName: row.userName.split(" ")[1] || "User",
          imageUrl: row.pictureURL || "",
          email: row.emailID,
        },
        comments: [], // can lazy-load comments separately
      };
    })
  );

  return posts;
}

/* DELETEPOST */
/*  Function used to delete a post from
    the database based on its unique ID.    */
export async function deletePost(postID: number) {
  try {
    // Fairly simple process, just mark the post as deleted in the database.
    await db.execute(
      "UPDATE Forum SET isDeleted = TRUE where forumID = ? AND isDeleted = FALSE", //Sets deleted flag without removing post from DB.
      [postID]
    );
  } catch (err: any) {
    //Usual error catching.
    console.error(err);
  }
}

/* DELETECOMMENT */
/*  Function used to delete a comment from
    the database based on its unique ID.    */
export async function deleteComment(commentID: number) {
  try {
    // Fairly simple process, just mark the comment as deleted in the database.
    await db.execute(
      "UPDATE ForumComment SET isDeleted = TRUE where commentID = ? AND isDeleted = FALSE", //Sets deleted flag without removing comment from DB.
      [commentID]
    );
  } catch (err: any) {
    //Usual error catching.
    console.error(err);
  }
}

/* CONSORTIUM */

/* FETCHCONSORTIUMALL */
/*  Function used to retrieve the top 50 consortium
    members from the database for display.  */
export async function fetchConsortiumAll() {
  try {
    const [rows] = await db.execute(`
      SELECT i.*, GROUP_CONCAT(t.tagName) AS tags
      FROM Instrument i
      LEFT JOIN InstrumentTag it ON i.instrumentID = it.instrumentID
      LEFT JOIN Tag t ON it.tagID = t.tagID
      WHERE i.isDeleted = FALSE
      GROUP BY i.instrumentID
      ORDER BY i.instrumentID DESC
      LIMIT 50
    `);

    const instruments: Instruments[] = (rows as any[]).map((row) => ({
      id: row.instrumentID,
      title: row.title,
      description: row.description,
      emailID: row.emailID,
      upload: row.uploadedAt,
      filePath: row.fileURL,
      tags: row.tags ? row.tags.split(",") : [],
    }));

    return instruments;
  } catch (err: any) {
    console.error(err);
    return []; // <-- always return an array
  }
}

/* FETCHCONSORTIUMNEXT */
/*  Function used to retrieve the next 50 consortium
    members from the database for display.  */
export async function fetchConsortiumNext(lastInstrumentID: number) {
  const [rows] = await db.execute(
    "SELECT * FROM Instrument WHERE instrumentID > ? ORDER BY instrumentID DESC LIMIT 50",
    [lastInstrumentID]
  ); //Gets the next 50 items after the last instrument ID provided.

  // STEP 2: Construct Instruments Array
  const instruments: Instruments[] = (rows as any[]).map((row) => ({
    id: row.instrumentID,
    description: row.description,
    title: row.title,
    emailID: row.emailID,
    upload: row.uploadedAt,
    filePath: row.fileURL,
  }));
  // STEP 3: Return Instruments Array
  return instruments;
}

/* FETCHCONSORTIUMUSER */
/*  Function used to retrieve consortium
    members uploaded by a specific user.  */
export async function fetchConsortiumUser(email: string) {
  const [rows] = await db.execute(
    "SELECT * FROM Instrument WHERE emailID = ? ORDER BY instrumentID DESC",
    [email]
  ); //Gets all items uploaded by the specified user.

  // STEP 2: Construct Instruments Array
  const instruments: Instruments[] = (rows as any[]).map((row) => ({
    id: row.instrumentID,
    title: row.title,
    description: row.description,
    emailID: row.emailID,
    upload: row.uploadedAt,
    filePath: row.fileURL,
  }));

  // STEP 3: Return Instruments Array
  return instruments;
}

/* FETCHCONSORTIUMTAG */
/*  Function used to retrieve consortium
    members based on a specific tag.  */
export async function fetchConsortiumTag(tag: string) {
  const [rows] = await db.execute(
    "SELECT * FROM Instrument WHERE tags LIKE ? ORDER BY instrumentID DESC",
    [`%${tag}%`]
  ); //Gets all items with the specified tag.

  // STEP 2: Construct Instruments Array
  const instruments: Instruments[] = (rows as any[]).map((row) => ({
    id: row.instrumentID,
    title: row.title,
    description: row.description,
    emailID: row.emailID,
    upload: row.uploadedAt,
    filePath: row.fileURL,
  }));

  // STEP 3: Return Instruments Array
  return instruments;
}

/* FETCHCONSORTIUMTAGNEXT */
/*  Function used to retrieve the next set of consortium
    members based on a specific tag.  */
export async function fetchConsortiumTagNext(
  tag: string,
  lastInstrumentID: number
) {
  const [rows] = await db.execute(
    "SELECT * FROM Instrument WHERE tags LIKE ? AND instrumentID > ? ORDER BY instrumentID DESC",
    [`%${tag}%`, lastInstrumentID]
  ); //Gets the next set of items with the specified tag.

  // STEP 2: Construct Instruments Array
  const instruments: Instruments[] = (rows as any[]).map((row) => ({
    id: row.instrumentID,
    title: row.title,
    description: row.description,
    emailID: row.emailID,
    upload: row.uploadedAt,
    filePath: row.fileURL,
  }));

  // STEP 3: Return Instruments Array
  return instruments;
}

/* DELETEINSTRUMENT */
/*  Function used to delete an instrument from
    the database based on its unique ID.    */
export async function deleteInstrument(instrumentID: number) {
  try {
    // Fairly simple process, just mark the instrument as deleted in the database.
    await db.execute(
      "UPDATE Instrument SET isDeleted = TRUE where instrumentID = ? AND isDeleted = FALSE", //Sets deleted flag without removing instrument from DB.
      [instrumentID]
    );
  } catch (err: any) {
    //Usual error catching.
    console.error(err);
  }
}

/* UPLOADFILE */
/*  Function used to upload a file to
    the database for consortium members.    */
export async function uploadFile(item: Upload, file: File) {
  //TO DO ::  Need to check if files can be sent directly to local storage or if
  //          they need to be routed through the backend first.
}

/* FETCHFILE */
/*  Function used to retrieve a file from
    the database based on its file name.    */
export async function fetchFile(fileName: string) {
  //TO DO ::  Need to check if files can be pulled directly from local storage or if
  //          they need to be routed through the backend first.
}

export async function likePost(postId: number, email: string) {
  try {
    // 1. Check whether this user already liked it
    const [exists] = await db.execute(
      `SELECT * FROM ForumLikes WHERE forumID = ? AND emailID = ?`,
      [postId, email]
    );

    const alreadyLiked = (exists as any[]).length > 0;

    if (alreadyLiked) {
      // 2. Remove like (UNLIKE)
      await db.execute(
        `DELETE FROM ForumLikes WHERE forumID = ? AND emailID = ?`,
        [postId, email]
      );

      await db.execute(
        `UPDATE Forum SET likeCount = likeCount - 1 WHERE forumID = ?`,
        [postId]
      );
    } else {
      // 3. Add like (LIKE)
      await db.execute(
        `INSERT INTO ForumLikes (forumID, emailID) VALUES (?, ?)`,
        [postId, email]
      );

      await db.execute(
        `UPDATE Forum SET likeCount = likeCount + 1 WHERE forumID = ?`,
        [postId]
      );
    }

    // 4. Return updated like count + whether THIS user liked it
    const [rows] = await db.execute(
      `SELECT likeCount FROM Forum WHERE forumID = ?`,
      [postId]
    );

    return {
      likes: (rows as any[])[0].likeCount,
      liked: !alreadyLiked, // flip state
    };
  } catch (err) {
    console.error("Error in likePost:", err);
    return null;
  }
}

export async function addComment(postId: number, text: string, email: string) {
  try {
    const [result] = await db.execute(
      `INSERT INTO ForumComment (forumID, emailID, body) VALUES (?, ?, ?)`,
      [postId, email, text]
    );

    const commentId = (result as any).insertId;

    return {
      id: commentId,
      text,
      userEmail: email,
    };
  } catch (err) {
    console.error("addComment error:", err);
    return null;
  }
}

/* CREATEEVENT */
/*  Function used by AdminPage to insert a new event into UpcomingEvents table. */
export async function createEvent(
  title: string,
  description: string,
  emailID: string,
  startDateTime: string,
  endDateTime: string,
  location: string
) {
  try {
    await db.execute(
      `INSERT INTO UpcomingEvents 
        (title, eventDescription, emailID, startDateTime, endDateTime, location) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, emailID, startDateTime, endDateTime, location]
    );
    console.log("Event created:", title);
  } catch (err: any) {
    console.error("Error in createEvent:", err);
  }
}

/* FETCHEVENTS */
/*  Function used by UpcomingEvents component to retrieve all events from DB. */
export async function fetchEvents() {
  try {
    const [rows] = await db.execute(
      `SELECT eventID, title, location, startDateTime, endDateTime
        FROM UpcomingEvents
        WHERE startDateTime >= NOW()
        ORDER BY startDateTime ASC;`
    );
    return rows as any[];
  } catch (err: any) {
    console.error("Error in fetchEvents:", err);
    return [];
  }
}

/* DELETE EVENT IF ADMIN*/
export async function deleteEvent(eventID: number) {
  try {
    await db.execute("DELETE FROM UpcomingEvents WHERE eventID = ?", [eventID]);
    console.log("Deleted event:", eventID);
  } catch (err: any) {
    console.error("Error in deleteEvent:", err);
  }
}

// Save a new upload request
export async function createUploadRequest(
  firstName: string,
  lastName: string,
  email: string,
  description: string,
  keywords: string[],
  fileName: string,
  fileURL: string,
  title: string
) {
  // Construct a URL pointing to the pdfs subfolder
  const uniqueName = Date.now() + "-" + fileName;

  // Insert into UploadRequest
  const [result]: any = await db.execute(
    `INSERT INTO UploadRequest (firstName, lastName, email, description, fileName, fileURL, title)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [firstName, lastName, email, description, fileName, fileURL, title]
  );

  const requestID = result.insertId;

  // Link tags
  for (const kw of keywords) {
    const [rows]: any = await db.execute(
      `SELECT tagID FROM Tag WHERE tagName = ?`,
      [kw]
    );
    if (rows.length > 0) {
      const tagID = rows[0].tagID;
      await db.execute(
        `INSERT INTO UploadRequestTag (requestID, tagID) VALUES (?, ?)`,
        [requestID, tagID]
      );
    }
  }

  return requestID;
}

// Fetch all pending upload requests
export async function fetchUploadRequests() {
  const [rows]: any = await db.execute(`
    SELECT ur.*, GROUP_CONCAT(t.tagName) AS tags
    FROM UploadRequest ur
    LEFT JOIN UploadRequestTag urt ON ur.requestID = urt.requestID
    LEFT JOIN Tag t ON urt.tagID = t.tagID
    WHERE ur.status = 'pending'
    GROUP BY ur.requestID
    ORDER BY ur.submittedAt DESC
  `);
  return rows;
}

// Approve an upload request (move into Instrument table)
export async function approveUploadRequest(requestID: number) {
  // Get request details
  const [rows]: any = await db.execute(
    `SELECT * FROM UploadRequest WHERE requestID = ?`,
    [requestID]
  );
  if (rows.length === 0) return null;
  const req = rows[0];

  // Insert into Instrument
  const [instrumentResult]: any = await db.execute(
    `INSERT INTO Instrument (title, description, emailID, fileURL)
     VALUES (?, ?, ?, ?)`,
    [req.title, req.description, req.email, req.fileURL ?? ""]
  );
  const instrumentID = instrumentResult.insertId;

  // Copy tags
  const [tags]: any = await db.execute(
    `SELECT tagID FROM UploadRequestTag WHERE requestID = ?`,
    [requestID]
  );
  for (const tag of tags) {
    await db.execute(
      `INSERT INTO InstrumentTag (instrumentID, tagID) VALUES (?, ?)`,
      [instrumentID, tag.tagID]
    );
  }

  // Update status
  await db.execute(
    `UPDATE UploadRequest SET status = 'approved' WHERE requestID = ?`,
    [requestID]
  );

  return instrumentID;
}

// Reject an upload request
export async function rejectUploadRequest(requestID: number) {
  await db.execute(
    `UPDATE UploadRequest SET status = 'rejected' WHERE requestID = ?`,
    [requestID]
  );
}
