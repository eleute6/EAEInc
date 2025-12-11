/* ACTIONS FOR PAGES TO USE */
/*
    DEVELOPER'S NOTE:
    This page contains within all actions that can or should be used by the various pages
    for this project. This is done for the ease of calling and for the sanity of any future
    development and fixing. Each function will be explained below through comments, though
    any questions should be researched in the technical document.
*/
'use server'
import type { Post } from "@/app/components/homepage/PostForum"
import type { User } from "./components/homepage/userinformation/UserInformation"
import type { Upload } from "./components/consortium/InstrumentConsortium"
import { db } from "@/app/database"
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
        // STEP 1: Query database for basic user info
        const [rows] = await db.execute(
            'SELECT userName, pictureURL FROM UserInfo WHERE emailID = ?',
            [email] );

        // STEP 2: Make the User object for use.
        const user: User = {
            name: (rows as any[])[0].userName || "Unknown User",
            picture: (rows as any[])[0].pictureURL || "",
            email: email
        };
        return user;
    } //In the case of failure, report back the error and set status.
    catch (err: any) {
        console.error(err);
    }
}

/* FETCHINFOFULL */
/*  Function used to retrieve full user information
    based on their email address for the profile page.  */
export async function fetchInfoFull(email: string) {
    try {
        // STEP 1: Query database for full user info
        const [rows] = await db.execute(
            'SELECT userName, department, currentContributionScore, highestContributionScore, isAdmin, pictureURL FROM UserInfo WHERE emailID = ?',
            [email] );
        
        // STEP 2: Make the User object for use.
        const user: UserFull = {
            name: (rows as any[])[0].userName || "Currently Empty",
            picture: (rows as any[])[0].pictureURL || "",
            bio: (rows as any[])[0].bio || "No Bio Set",
            email: email,
            department: (rows as any[])[0].department || "Currently Empty",
            currentContributionScore: (rows as any[])[0].currentContributionScore || 0,
            highestContributionScore: (rows as any[])[0].highestContributionScore || 0,
            isAdmin: (rows as any[])[0].isAdmin || false
        };
        return user;
    } //Usual error catching.
    catch (err: any) {
        console.error(err);
    }
}

/* INITIALUSERINFO */
/*  Function used to add initial user information
    to the database when they first log in.  */
export async function initialUserInfo(name: string, email: string, picture: string, admin: boolean) {
    /* STEP 1: Check if User Already Exists */
    const [rows] = await db.execute(
        'SELECT COUNT(*) as count FROM UserInfo WHERE emailID = ?',
        [email] );
    const count = (rows as any[])[0].count || 0;

    /* STEP 2: If New User, Insert into Database */
    if (count === 0) {
        try {
            await db.execute(
                'INSERT INTO UserInfo (userName, emailID, pictureURL, bio, department, currentContributionScore, highestContributionScore, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [name, email, picture, 'Not Specified', 'Not Specified', 0, 0, admin]
            );
        }
        // Usual error catching.
        catch (err: any) {
            console.error(err);
        }
    }
}

/* UPDATEUSERINFO */
/*  Function used to update user information for profile page
    in the database based on the information provided.  */
export async function updateUserInfo(fData: FormData) {
    // STEP 1: Extract data from FormData
    const name = fData.get('name') as string;
    const department = fData.get('department') as string;
    const email = fData.get('email') as string;
    const bio = fData.get('bio') as string;
    const picture = fData.get('picture') as string;

    // STEP 2: Update database with new information
    try {
        await db.execute(
            'UPDATE UserInfo SET userName = ?, department = ?, pictureURL = ?, bio = ? WHERE emailID = ?',
            [name, department, picture, bio, email]
        );
    }
    // Usual error catching.
    catch (err: any) {
        console.error(err);
    }
}

/* UPDATECONTRIBUTIONSCORE */
/*  Function used to update a user's contribution
    score in the database based on their email.    */
export async function updateContributionScore(email: string, score: number) {
    try { //STEP 1: Update database with new contribution score.
        await db.execute(
            'UPDATE UserInfo SET currentContributionScore = currentContributionScore + ? WHERE emailID = ?',
            [score, email]
        );
    }
    // Usual error catching.
    catch (err: any) {
        console.error(err);
    }
}

/* FORUM POSTS */


/* SENDPOST */
/*  Function used to send data from a post
    and then update the list of forum posts.    */
export async function sendPost(post: Post) {
    // STEP 1: Extract data from post object
     const text = post.text;
     const image = post.image;
     const user = post.user;
     const email = user.email;
     const name = user.firstName + ' ' + user.lastName;

     // STEP 2: Send data to backend
     try {
        //Try to send to database the new post.
        await db.execute(
            'INSERT INTO Forum (body, userName, imageURL, emailID) VALUES (?, ?, ?, ?)', //All manually filled information for a post.
            [text, name, image, email] //The values to insert into the database.
        );
     } //Usual error catching.
     catch (err: any) {
        console.error(err);
     }
}

/* SENDCOMMENT */
/*  Function used to send data from a comment
    and then update the list of comments for a post.    */
export async function sendComment(fData: FormData) {
    // STEP 1: Extract data from comment object
     const forumID = fData.get('forumID');
     const body = fData.get('body') as string;
     const emailID = fData.get('emailID') as string;

    // STEP 2: Send data to backend
    try {
        //Try to send to database the new comment.
        await db.execute(
            'INSERT INTO ForumComment (forumID, emailID, body) VALUES (?, ?, ?)', //All manually filled information for a comment.
            [forumID, emailID, body] //The values to insert into the database.
        );
    }
    // Usual error catching.
    catch (err: any) {
        console.error(err);
    }
}

/* FETCHPOSTS */
/*  Function used to retrieve the first 50 posts 
    from the database to be displayed in the forum. */
export async function fetchPosts() {
    try {
        // STEP 1: Query Database for Posts
        const [rows] = await db.execute(
            'SELECT * FROM Forum WHERE isDeleted = FALSE ORDER BY forumID DESC LIMIT 50'); //Gets the Latest 50 Posts from the Forum Table.
        // STEP 2: Construct Posts Array
        const posts: Post[] = (rows as any[]).map((row) => ({
            id: row.forumID,
            text: row.body,
            image: row.imageURL || null, 
            user: { 
                firstName: row.name.split(' ')[0] || "Unknown",
                lastName: row.name.split(' ')[1] || "User",
                imageUrl: row.pictureURL || "",
                email: row.emailID || "unknown@email.com"
            }
        }));
        // STEP 3: Return Posts Array
        return posts;
    } //Usual error catching.
    catch (err: any) {
        console.error(err);
        return [];
    }
}

/* FETCHCOMMENTS */
/*  Function used to retrieve all comments 
    for a specific post from the database. */
export async function fetchComments(forumID: number) {
    try {
        // STEP 1: Query Database for Comments
        const [rows] = await db.execute(
            'SELECT * FROM ForumComment WHERE forumID = ? AND isDeleted = FALSE ORDER BY commentID ASC',
            [forumID]); //Gets all comments for the specified post.

        // STEP 2: Construct Comments Array
        const comments: Comments[] = (rows as any[]).map((row) => ({
            commentID: row.commentID,
            forumID: row.forumID,
            emailID: row.emailID,
            body: row.body
        }));
        // STEP 3: Return Comments Array
        return comments;
    } //Usual error catching.
    catch (err: any) {
        console.error(err);
        return [];
    }
}

/* FETCHNEXT */
/*  Function used to retrieve the next 50 posts
    from the database to be displayed in the forum. */
export async function fetchNext(lastPostID: number) {
    const [rows] = await db.execute(
        'SELECT * FROM Forum WHERE forumID < ? AND isDeleted = FALSE ORDER BY forumID DESC LIMIT 50',
        [lastPostID]); //Gets the next 50 posts after the last post ID provided.

    // STEP 2: Construct Posts Array
    const posts: Post[] = (rows as any[]).map((row) => ({
            id: row.forumID,
            text: row.body,
            image: row.imageURL || null, 
            user: { 
                firstName: row.name.split(' ')[0] || "Unknown",
                lastName: row.name.split(' ')[1] || "User",
                imageUrl: row.pictureURL || "",
                email: row.emailID || "unknown@email.com"
            }
    }));

    // STEP 3: Return Posts Array
    return posts;
}   

/* DELETEPOST */
/*  Function used to delete a post from
    the database based on its unique ID.    */
export async function deletePost(postID: number) {
    try {
        // Fairly simple process, just mark the post as deleted in the database.
        await db.execute(
            'UPDATE Forum SET isDeleted = TRUE where forumID = ? AND isDeleted = FALSE', //Sets deleted flag without removing post from DB.
            [postID]
        );
    } //Usual error catching.
    catch (err: any) {
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
            'UPDATE ForumComment SET isDeleted = TRUE where commentID = ? AND isDeleted = FALSE', //Sets deleted flag without removing comment from DB.
            [commentID]
        );
    } //Usual error catching.
    catch (err: any) {
        console.error(err);
    }
}

/* CONSORTIUM */


/* FETCHCONSORTIUMALL */
/*  Function used to retrieve the top 50 consortium
    members from the database for display.  */
export async function fetchConsortiumAll() {
    try {
        // STEP 1: Query Database for Consortium Items
        const [rows] = await db.execute(
            'SELECT * FROM Instrument ORDER BY instrumentID DESC LIMIT 50'); //Gets the first 50 items from the Instruments Table.
        // STEP 2: Construct Instruments Array
        const instruments: Instruments[] = (rows as any[]).map((row) => ({
            id: row.instrumentID,
            title: row.title,
            description: row.description,
            emailID: row.emailID,
            upload: row.uploadedAt,
            filePath: row.fileURL
        }));
        // STEP 3: Return Instruments Array
        return instruments; 
    }
    catch (err: any) { //Usual error catching.
        console.error(err);
    }
}

/* FETCHCONSORTIUMNEXT */
/*  Function used to retrieve the next 50 consortium
    members from the database for display.  */
export async function fetchConsortiumNext(lastInstrumentID: number) {
    const [rows] = await db.execute(
        'SELECT * FROM Instrument WHERE instrumentID > ? ORDER BY instrumentID DESC LIMIT 50',
        [lastInstrumentID]); //Gets the next 50 items after the last instrument ID provided.

    // STEP 2: Construct Instruments Array
    const instruments: Instruments[] = (rows as any[]).map((row) => ({
        id: row.instrumentID,
        description: row.description,
        title: row.title,
        emailID: row.emailID,
        upload: row.uploadedAt,
        filePath: row.fileURL
    }));
    // STEP 3: Return Instruments Array
    return instruments; 
}   

/* FETCHCONSORTIUMUSER */
/*  Function used to retrieve consortium
    members uploaded by a specific user.  */
export async function fetchConsortiumUser(email: string) {
    const [rows] = await db.execute(
        'SELECT * FROM Instrument WHERE emailID = ? ORDER BY instrumentID DESC',
        [email]); //Gets all items uploaded by the specified user.

    // STEP 2: Construct Instruments Array
    const instruments: Instruments[] = (rows as any[]).map((row) => ({
        id: row.instrumentID,
        title: row.title,
        description: row.description,
        emailID: row.emailID,
        upload: row.uploadedAt,
        filePath: row.fileURL
    }));

    // STEP 3: Return Instruments Array
    return instruments; 
}   

/* FETCHCONSORTIUMTAG */
/*  Function used to retrieve consortium
    members based on a specific tag.  */
export async function fetchConsortiumTag(tag: string) {
    const [rows] = await db.execute(
        'SELECT * FROM Instrument WHERE tags LIKE ? ORDER BY instrumentID DESC',
        [`%${tag}%`]); //Gets all items with the specified tag.

    // STEP 2: Construct Instruments Array
    const instruments: Instruments[] = (rows as any[]).map((row) => ({
        id: row.instrumentID,
        title: row.title,
        description: row.description,
        emailID: row.emailID,
        upload: row.uploadedAt,
        filePath: row.fileURL
    }));
    
    // STEP 3: Return Instruments Array
    return instruments;
}

/* FETCHCONSORTIUMTAGNEXT */
/*  Function used to retrieve the next set of consortium
    members based on a specific tag.  */
export async function fetchConsortiumTagNext(tag: string, lastInstrumentID: number) {
    const [rows] = await db.execute(
        'SELECT * FROM Instrument WHERE tags LIKE ? AND instrumentID > ? ORDER BY instrumentID DESC',
        [`%${tag}%`, lastInstrumentID]); //Gets the next set of items with the specified tag.

    // STEP 2: Construct Instruments Array
    const instruments: Instruments[] = (rows as any[]).map((row) => ({
        id: row.instrumentID,
        title: row.title,
        description: row.description,
        emailID: row.emailID,
        upload: row.uploadedAt,
        filePath: row.fileURL
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
            'UPDATE Instrument SET isDeleted = TRUE where instrumentID = ? AND isDeleted = FALSE', //Sets deleted flag without removing instrument from DB.
            [instrumentID]
        );
    } //Usual error catching.
    catch (err: any) {
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