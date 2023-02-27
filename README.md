# How to run



# Assumptions/scope limitations
The random user API provides a large amount of personal information. Some is sensitive or PII, like exact addresses, login info, and what appears to be a close analogue of SSN. It seemed obvious to me that we do not want to be exposing information like this to hiring managers, so I chose a reasonable subset of information for the manager to make a decision:
    - name (last, first)
    - country
    - postcode (so that you can determine whether the job is a reasonable commute for this person)
    - email
    - both available phone #'s, for cases where a user provides one but not both
    - a photo so that the hiring manager can recognize the person (this should be run by HR, as it can support discriminatory hiring practices, but it seemed as though it would be a very likely ask for such an application)

Typically, FE best practices would dictate that some accessibility features be made available. I am not very experienced in working with aria-labels and the like, but it's an area where I'd like to get more experience. I timeboxed my effort for this takehome assignment and determined that accessibility support was just outside of my timebox.


