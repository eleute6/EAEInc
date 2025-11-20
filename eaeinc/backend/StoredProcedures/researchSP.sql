use ResearchPageDB;

-- Procedure to create a forum post
delimiter $$
create procedure CreateForumPost(
  in pEmailID varchar(100),
  in pTitle varchar(255),
  in pBody text,
  in pSearchTag varchar(100)
)

begin
  declare v_forumID int;

  start transaction;
    insert into Forum (title, body, emailID, searchTag)
    values (pTitle, pBody, pEmailID, pSearchTag);

    set v_forumID = last_insert_id();

    update UserInfo
    set currentContributionScore = currentContributionScore + 3,
        highestContributionScore = greatest(highestContributionScore, currentContributionScore + 5)
    where emailID = pEmailID;
  commit;

  select v_forumID as forumID;
end$$
delimiter ;

-- Procedure to create a forum comment
drop procedure if exists AddForumComment;

DELIMITER $$
create procedure AddForumComment(
  in pForumID int,
  in pEmailID varchar(100),
  in pBody text
)
begin
  if not exists (select 1 from Forum where forumID = pForumID and isDeleted = 0) then
    signal sqlstate '45000' set message_text = 'Forum post not found or deleted';
  end if;

  start transaction;
    insert into ForumComment (forumID, emailID, body, postedAt)
    values (pForumID, pEmailID, pBody, current_timestamp);

    update UserInfo
    set currentContributionScore = currentContributionScore + 2,
        highestContributionScore = greatest(highestContributionScore, currentContributionScore + 2)
    where emailID = pEmailID;
  commit;
end$$
delimiter ;

-- Procedure to upload an instrument 
drop procedure if exists UploadInstrument;

DELIMITER $$
create procedure UploadInstrument(
  in pEmailID varchar(100),
  in pTitle varchar(255),
  in pFileURL varchar(500),
  in pSearchTag varchar(100)
)
begin
  declare v_instrumentID int;

  -- Verify user exists
  if not exists (select 1 from UserInfo where emailID = pEmailID) then
    signal sqlstate '45000' set message_text = 'User does not exist';
  end if;

  start transaction;
    -- Insert new instrument record
    insert into Instrument (title, emailID, fileURL, searchTag)
    values (pTitle, pEmailID, pFileURL, pSearchTag);

    -- Get the new instrument’s ID
    set v_instrumentID = last_insert_id();

    -- Update contribution score (+3 points for uploads)
    update UserInfo
    set currentContributionScore = currentContributionScore + 3,
        highestContributionScore = greatest(highestContributionScore, currentContributionScore + 3)
    where emailID = pEmailID;

  commit;

  -- Return confirmation
  select v_instrumentID as instrumentID;
end$$
delimiter ;







