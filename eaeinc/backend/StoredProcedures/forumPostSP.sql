use ResearchPageDB;

-- Procedure to store forum post data in database once provided by user
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
        highestContributionScore = greatest(highestContributionScore, currentContributionScore + 3)
    where emailID = pEmailID;
  commit;

  select v_forumID as forumID;
end$$
delimiter ;








