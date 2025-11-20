use ResearchPageDB;

-- Procedure to upload an instrument 
drop procedure if exists UploadInstrument;

delimeter $$
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