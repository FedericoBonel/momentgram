
## Data model

We are not going to mantain likes or comments as arrays since that would provoke an unbundled growing array, something that is not recommended on mongoDB at least.
For this reason the data model will be "normalized" or at least to a degree. This will allow more scalability and not overflowing documents.