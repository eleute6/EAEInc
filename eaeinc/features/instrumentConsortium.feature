Feature: Instrument consortium search and browsing
  As a researcher
  I want to search shared instruments and documents
  So that I can quickly find relevant resources

  Background:
    Given a signed-in user is on the Instrument Consortium page
    And available uploads have been loaded from the consortium service

  Scenario: Searching by keyword or title
    When the user enters a keyword in the search bar
    Then uploads whose titles or keywords include that keyword are displayed
    And uploads that do not match the keyword are hidden

  Scenario Outline: Searching by multiple tags
    When the user enters "<tags>" in the search bar
    Then only uploads tagged with any of <tags> are shown in the list
    And uploads without matching tags are hidden

    Examples:
      | tags           |
      | AI    |
      | Budget     |
      | Compliance      |

  Scenario: Clearing the search to view all uploads
    Given uploads are currently filtered by a search term
    When the user clears the search input so it is empty
    Then the full list of consortium uploads is displayed again

  Scenario: Opening a consortium document
    Given an upload is listed with a PDF link
    When the user selects the "View PDF" link for that upload
    Then the PDF opens in a new browser tab using the stored file path