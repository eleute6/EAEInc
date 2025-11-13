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

-- Test call and display of test data
CALL CreateForumPost(
  'leutee',
  'How to submit LC/MS data to ORSP?',
  'Has anyone uploaded mass spec data and tagged it for search?',
  'mass spec'
);
SELECT * FROM Forum ORDER BY forumID DESC;

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

-- Test comment 
call AddForumComment(1, 'leutee', 'This is my first comment!');

-- Call to display comments for testing purposes
select commentID, forumID, emailID, body, postedAt
from ForumComment
where forumID = 1
order by postedAt desc;





