-- DELETE BEFORE MERGING BRANCH TO DEVELOP; SOLELY FOR REFACTORING PURPOSES
- Procedure to create a forum post
delimiter $$
create procedure CreateForumPost(
  in pEmailID varchar(100),
  in pTitle varchar(255),
  in pBody text,
  in pImageUrl  varchar(500),
  in pSearchTag varchar(100)
)

begin
  declare v_forumID int;

  start transaction;
    insert into Forum (title, body, imageUrl, emailID, searchTag)
    values (pTitle, pBody, pImageUrl, pEmailID, pSearchTag);

    set v_forumID = LAST_INSERT_ID();

    update UserInfo
    set currentContributionScore = currentContributionScore + 3,
        highestContributionScore = GREATEST(highestContributionScore, currentContributionScore + 5)
    where emailID = pEmailID;
  commit;

  select v_forumID as forumID;
end$$
delimiter 