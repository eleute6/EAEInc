use ResearchPageDB;

-- Procedure to create a forum comment
drop procedure if exists AddForumComment;

delimeter $$
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