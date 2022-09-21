# Back-end Server

This is the backend of the system, it was developed using nodejs, mongodb, Mongoose as the database API, and ExpressJS.

## Code Organization

The code is structured and modularized in 4 main layers as follows:

* **Models**: Encapsulates all logic related to defining the data models as **they are persisted in the database**.
* **Repositories**: Encapsulates all logic related to manipulation and access of the data models defined on the Model layer. This includes mantaining data consistent and house keeping.
* **Services**: Encapsulates all business logic. This is the layer where the raw data as it is persisted gets transformed to the exposed one (i.e. Age attributes get calculated, arrays get populated, etc.). The main objective of this is to encapsulate a whole business operation/transaction (which may involve multiple data access or operations) as a unity and to translate it to data management.
* **Controllers**: Encapsulates all request handling. This is were the requests arrive and get handled as it's needed (normally calling one or multiple services).

The way each layer interacts with each other is showed in the following figure where every arrow is a reference:

![ConSerRepMod](https://i.imgur.com/yxPFw2a.png)

So this way Controller calls to Service, Service may call to other Services and/or a Repository, and Repository may call to other Repositories and/or a Model which in turn access the database and handles its data.

This separation of concerns is very traditional (used quite a bit in Java Spring based systems) and we could argue that the repository layer may not be necessary since Mongoose is providing us with a clear API to access the database through our models. While this is true, in this project we do have documents with references to other documents, and cascading operations are not performed by Mongoose. For this reason I think having that extra layer of logic to handle any kind of cascading or reference change is important and allows for a clearer more mantainable code.

## Data model

The data model is very straight forward and clear in the Model layer.
One of the decisions I decided to make was to not keep likes or comments as nested objects. We are not doing this since that would provoke an unbounded growing array in the database, something that is not recommended on mongoDB at least since each document can have at most 16MB, and if we consider that a post may have millions of comments on Instagram this is not something you need or want. Besides we may want to access this comments or likes separately (i.g. to see all user comments for moderation) and this is a good reason to not embedd documents on MongoDB.
For this reasons the data model is "normalized" (Breaking the "No Rules" rule of documental and NoSQL databases) or at least to a degree. This will allow more scalability and not overflowing documents.

