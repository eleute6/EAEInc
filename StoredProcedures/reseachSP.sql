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

    set v_forumID = LAST_INSERT_ID();

    update UserInfo
    set currentContributionScore = currentContributionScore + 5,
        highestContributionScore = GREATEST(highestContributionScore, currentContributionScore + 5)
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





