-- Merrimack College Community Research Page Database

drop database if exists ResearchPageDB;
create database ResearchPageDB;
use ResearchPageDB;

-- User Info Table
-- Stores information relevant to identify users
create table UserInfo (
    emailID varchar(100) primary key,   
    userName varchar(100) not null,     
    department varchar(100),
    bio varchar (5000),
    currentContributionScore int default 0,
    highestContributionScore int default 0,
    isAdmin boolean default 0, 
    pictureURL varchar(500)
);

-- Tag Table (loaded from CSV)
create table Tag (
    tagID int auto_increment primary key,
    tagName varchar(100) unique not null
);

-- Instrument Table
-- Stores information about a given instrument
create table Instrument (
    instrumentID int auto_increment primary key,
    title varchar(255) not null,
    description varchar(5000),
    emailID varchar(100),
    uploadedAt timestamp default current_timestamp,
    fileURL varchar(500),
    isDeleted boolean default 0,
    foreign key (emailID) references UserInfo(emailID)
);

-- InstrumentTag junction table
-- Allows many-to-many relationship between instruments and tags
create table InstrumentTag (
    instrumentID int not null,
    tagID int not null,
    primary key (instrumentID, tagID),
    foreign key (instrumentID) references Instrument(instrumentID) on delete cascade,
    foreign key (tagID) references Tag(tagID) on delete cascade
);

-- Forum Table
-- Stores information about a given forum post
create table Forum (
    forumID int auto_increment primary key,
    body text not null,
    emailID varchar(100),
    userName varchar(100),
    pictureURL varchar(500),
    likeCount int default 0,
    imageURL varchar(500),
    uploadedAt timestamp default current_timestamp,
    isDeleted boolean default 0,
    foreign key (emailID) references UserInfo(emailID),
    foreign key (userName) references UserInfo(userName),
    foreign key (pictureURL) references UserInfo(pictureURL)
);

-- Forum comment table
-- Stores information about a given forum comment
create table ForumComment (
	commentID int auto_increment primary key,
    forumID int not null,
    emailID varchar(100),
    body text not null,
    postedAt timestamp not null default current_timestamp,
    isDeleted boolean default 0,
    foreign key (forumID) references Forum(forumID) on delete cascade,
    foreign key (emailID) references UserInfo(emailID) on delete cascade
);


-- Upcoming Events Table
-- Stores information about all events listed in upcoming events section
create table UpcomingEvents (
    eventID int auto_increment primary key,
    title varchar(255) not null,
    eventDescription varchar(500),
    emailID varchar(100) not null,
    startDateTime timestamp not null,
	endDateTime timestamp not null,
    location varchar(255),
    foreign key (emailID) references UserInfo(emailID) on delete cascade
);

-- Event attendees table
-- Stores attendee information for each listed event
create table eventAttendees (
	eventID int not null,
    attendeeEmailID varchar(100), 
    attendanceStatus enum ('attending', 'not attending', 'might attend'),
    respondedAt timestamp not null default current_timestamp,
    foreign key (eventID) references UpcomingEvents(eventID),
    foreign key (attendeeEmailID) references UserInfo(emailID),
    primary key (eventID, attendeeEmailID)
);


    
    

