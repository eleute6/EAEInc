Feature: Admin dashboard management
  As an administrator
  I want to manage events and uploaded research requests
  So that the portal stays current and curated

  Background:
    Given an authenticated admin is on the admin dashboard
    And the dashboard has loaded the list of upcoming events and pending upload requests

  Scenario: Creating a new event
    When the admin enters a title, date, and location for an event
    And the admin submits the create event form
    Then the event is stored through the backend create event service
    And a success popup confirms the event was created
    And the new event appears in the list of upcoming events with its title, location, and date

  Scenario: Deleting an existing event after confirming
    Given an event appears in the upcoming events list
    When the admin chooses to delete that event
    Then a delete confirmation dialog is shown
    When the admin confirms the deletion
    Then the event is removed from the list after the backend deletion completes

  Scenario: Approving an upload request
    Given a pending upload request is visible with requester details and a PDF link
    When the admin approves the request
    Then the request is marked approved through the backend service
    And the approved request no longer appears in the pending uploads list

  Scenario: Rejecting an upload request
    Given a pending upload request is visible
    When the admin rejects the request
    Then the request is marked rejected through the backend service
    And the rejected request no longer appears in the pending uploads list