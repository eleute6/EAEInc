/* ACTIONS FOR PAGES TO USE */
/*
    DEVELOPER'S NOTE:
    This page contains within all actions that can or should be used by the various pages
    for this project. This is done for the ease of calling and for the sanity of any future
    development and fixing. Each function will be explained below through comments, though
    any questions should be researched in the technical document.
*/
'use server'
import type { Post } from "@/components/PostForum"
import type { User } from "@/components/UserInformation"
import { db } from "@/app/database"
import { NextResponse } from "next/server";

/* TEMPORARY INTERFACES */
interface UserFull {
    name: string;
    email: string;
    picture: string;
    department: string;
    currentContributionScore: number;
    highestContributionScore: number;
    isAdmin: boolean;
}

interface Instruments {
    id: number;
    title: string;
    emailID: string;
    upload: number;
    filePath: string;
}

/* USER INFO FETCHING */


/* FETCHINFOSMALL */
/*  Function used to retrieve basic user information
    based on their email address for the mini profile.  */
export async function fetchInfoSmall(email: string) {
    try {
        // STEP 1: Query database for basic user info
        const [rows] = await db.execute(
            'SELECT userName, pictureUrl FROM Users WHERE emailID = ?',
            [email] );

        // STEP 2: Make the User object for use.
        const user: User = {
            name: (rows as any[])[0].userName || "Unknown User",
            picture: (rows as any[])[0].pictureUrl || "",
            email: email
        };
        return user;
    } //In the case of failure, report back the error and set status.
    catch (err: any) {
        return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
    }
}

/* FETCHINFOFULL */
/*  Function used to retrieve full user information
    based on their email address for the profile page.  */
export async function fetchInfoFull(email: string) {
    try {
        // STEP 1: Query database for full user info
        const [rows] = await db.execute(
            'SELECT userName, department, currentContributionScore, highestContributionScore, isAdmin, pictureUrl FROM Users WHERE emailID = ?',
            [email] );
        
        // STEP 2: Make the User object for use.
        const user: UserFull = {
            name: (rows as any[])[0].userName || "Unknown User",
            picture: (rows as any[])[0].pictureUrl || "",
            email: email,
            department: (rows as any[])[0].department || "Unknown Department",
            currentContributionScore: (rows as any[])[0].currentContributionScore || 0,
            highestContributionScore: (rows as any[])[0].highestContributionScore || 0,
            isAdmin: (rows as any[])[0].isAdmin || false
        };
        return user;
    } //Usual error catching.
    catch (err: any) {
        return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
    }
}

/* FORUM POSTS */


/* SENDPOST */
/*  Function used to send data from a post
    and then update the list of forum posts.    */
export async function sendPost(post: Post) {
    // STEP 1: Extract data from post object
     const title = "post" + post.id; // Placeholder Title
     const text = post.text;
     const image = post.image; // Not Used in DB Currently? 
     const user = post.user;
     const email = user.email;

     // STEP 2: Send data to backend
     try {
        //Try to send to database the new post.
        await db.execute(
            'INSERT INTO Forum (title, body, emailID, searchTag) VALUES (?, ?, ?, ?)', //All manually filled information for a post.
            [title, text, email, 'general'] //The values to insert into the database.
        );
     } //Usual error catching.
     catch (err: any) {
        return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
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
            image: row.image || null, //Currently nonexistent as well.
            user: { //Currently nonexistent in the database, so using placeholder data.
                firstName: row.firstName || "Unknown",
                lastName: row.lastName || "User",
                imageUrl: row.imageUrl || "",
                email: row.emailID || "unknown@email.com"
            }
        }));
        // STEP 3: Return Posts Array
        return posts;
    } //Usual error catching.
    catch (err: any) {
        return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
    }
}

/* FETCHNEXT */
/*  Function used to retrieve the next 50 posts
    from the database to be displayed in the forum. */
export async function fetchNext(lastPostID: number) {
    const [rows] = await db.execute(
        'SELECT * FROM Forum WHERE forumID > ? AND isDeleted = FALSE ORDER BY forumID DESC LIMIT 50',
        [lastPostID]); //Gets the next 50 posts after the last post ID provided.

    // STEP 2: Construct Posts Array
    const posts: Post[] = (rows as any[]).map((row) => ({
            id: row.forumID,
            text: row.body,
            image: row.image || null, //Currently nonexistent as well.
            user: { //Currently nonexistent in the database, so using placeholder data.
                firstName: row.firstName || "Unknown",
                lastName: row.lastName || "User",
                imageUrl: row.imageUrl || "",
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
        return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
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
            emailID: row.emailID,
            upload: row.uploadedAt,
            filePath: row.fileURL
        }));
        // STEP 3: Return Instruments Array
        return instruments; 
    }
    catch (err: any) { //Usual error catching.
        return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
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
        title: row.title,
        emailID: row.emailID,
        upload: row.uploadedAt,
        filePath: row.fileURL
    }));
    // STEP 3: Return Instruments Array
    return instruments; 
}   