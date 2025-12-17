Feature: Forum interactions
  As a signed-in community member
  I want to post updates and interact with others
  So that collaboration happens in the research portal

  Background:
    Given a user has signed in with Google
    And the user is viewing the community feed

  Scenario: Publishing a text-only post
    Given the post composer is empty
    When the user enters "Excited to share new findings" into the post input
    And the user submits the post without attaching an image
    Then the post is sent to the server
    And the feed shows the new post at the top with the submitted text and the user's name
    And the post form resets so the input and attachment fields are cleared

  Scenario: Displaying an image preview before posting
    When the user selects an image file in the post composer
    Then a thumbnail preview of the selected image is displayed
    And the image filename is shown next to the composer

  Scenario: Removing an attached image before posting
    Given an image has been selected in the post composer
    When the user removes the image preview
    Then the file input is cleared
    And no image will be uploaded with the post

  Scenario: Liking and unliking a post
    Given a post in the feed is not currently liked by the user
    When the user taps the like control on that post
    Then the like count for the post increases by 1
    And the post shows as liked by the user
    When the user taps the like control again
    Then the like count decreases by 1
    And the post shows as not liked by the user

  Scenario: Adding and removing a comment on a post
    Given a post is visible in the feed
    When the user enters "Great update, thanks for sharing" into the comment input for that post
    And the user submits the comment
    Then the comment appears under the post with the user's name and email recorded
    And the comment input for that post is cleared
    When the user deletes their own comment on that post
    Then the deleted comment no longer appears in the comment list

  Scenario: Deleting a post the user authored
    Given the user authored a post shown in the feed
    When the user chooses to delete the post and confirms the deletion
    Then the post is removed from the feed after the server deletion completes
