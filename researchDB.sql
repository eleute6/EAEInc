drop database if exists ResearchPageDB;
create database ResearchPageDB;
use ResearchPageDB;

-- User Info Table
create table UserInfo (
    emailID varchar(100) primary key,   
    userName varchar(100) not null,     
    department varchar(100),
    currentContributionScore int default 0,
    highestContributionScore int default 0,
    isAdmin boolean default 0
);

-- Instrument Table
create table Instrument (
    instrumentID int auto_increment primary key,
    title varchar(255) not null,
    emailID varchar(100),
    uploadedAt timestamp default current_timestamp,
    fileURL varchar(500),
    searchTag varchar(100),
    isDeleted boolean default 0,
    foreign key (emailID) references UserInfo(emailID)
);

-- Forum Table
create table Forum (
    forumID int auto_increment primary key,
    title varchar(255) not null,
    body text not null,
    emailID varchar(100),
    uploadedAt timestamp default current_timestamp,
    searchTag varchar(100),
    isDeleted boolean default 0,
    foreign key (emailID) references UserInfo(emailID)
);

-- Forum comment table
create table ForumComment (
	commentID int auto_increment primary key,
    forumID int not null,
    emailID varchar(100),
    body text not null,
    postedAt timestamp not null,
    isDeleted boolean default 0,
    foreign key (forumID) references Forum(forumID) on delete cascade,
    foreign key (emailID) references UserInfo(emailID) on delete cascade
);


-- Upcoming Events Table
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
create table eventAttendees (
	eventID int not null,
    attendeeEmailID varchar(100), 
    attendanceStatus enum ('attending', 'not attending', 'might attend'),
    respondedAt timestamp not null default current_timestamp,
    foreign key (eventID) references UpcomingEvents(eventID),
    foreign key (attendeeEmailID) references UserInfo(emailID),
    primary key (eventID, attendeeEmailID)
);



    
    

