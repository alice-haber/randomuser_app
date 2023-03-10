# My Dev Environment/Dependencies
I developed and tested this using:
    node v19.7.0
    npm 9.5.0 (installed using npx)

# How to run
To install dependencies, run `npm i` in the root project directory.

To run tests, run `npm run test` in the root project directory.

To run a development build (will render twice on page load due to default dev env React Strict Mode rules),
    run `npm start`

To build a production build (static html with assets and js files) run `npm run build`

# Assumptions/scope limitations
The random user API provides a large amount of personal information. Some is sensitive or PII, like exact addresses, login info, and what appears to be a close analogue of SSN. It seemed obvious to me that we do not want to be exposing information like this to hiring managers, so I chose a reasonable subset of information for the manager to make a decision:
    - name (last, first)
    - country
    - postcode (so that you can determine whether the job is a reasonable commute for this person)
    - email
    - both available phone #'s, for cases where a user provides one but not both
    - a photo so that the hiring manager can recognize the person (this should be run by HR, as it can support discriminatory hiring practices, but it seemed as though it would be a very likely ask for such an application)

Typically, FE best practices would dictate that some accessibility features be made available. I am not very experienced in working with aria-labels and the like, but it's an area where I'd like to get more experience. I timeboxed my effort for this takehome assignment and determined that advanced accessibility support was just outside of my timebox.

Emotion is included by default with Material UI for styling and I saw no compelling reason to change that.

When executing the "Undo" action on historical candidate action, I felt it made sense to populate the form with that candidate's information again so that the hiring manager can make a new decision on the candidate, write a new comment, etc. I determined this was out of timebox scope, but this is the direction I'd likely suggest to Product if I were working on this software in the real world.

I chose to leave a lot of the create-react-app boilerplate alone because the stated scope (2-4 hours) of this project does not allow for perfect polishing and removing all unnecessary boilerplate code and resources.

I assumed that it would be alright for a toy project to have the candidate and review pages exist on one "page", but in a production app I'd recommend the Candidate History be located in a modal or even its own routed page. This would require shuffling React state around a bit, and may benefit more advanced state tooling like React Contexts or Redux.
