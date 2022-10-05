# Back-end Server

This is the backend of the system, it was developed using nodejs, mongodb, Mongoose as the database API, and ExpressJS.

## How to use this?

Simple, 

1. Install nodeJS.
2. Clone this repository.

3. Go to the server folder:

        cd ./server
        
4. Set up your MongoDB database, this could be on MongoDB Atlas or on a docker container.
5. Set up your SMTP server for sending verification emails when registering users (you could use gmail here or any other you want).
6. Set your environment variables (either by running the app.js with those variables declared or adding a .env file to the /server folder):
        
        PORT=Your desired port
        MONGODB_URI=mongodb+srv://user:password@yourMongDBUrl/yourDatabase?retryWrites=true&w=majority
        SECRET=The secret used to sign your JWTs
        EXPIRATION_TIME=The expiration time of your JWTs (i.g. "30d")
        API_BASE_URL=Your desired base API url (i.g. "/api/v1")
        MAX_IMG_SIZE=Your desired max image file size on MB (i.g. 5)
        EMAIL_HOST=Your desired SMTP host for sending the verification emails (i.g. smtp.gmail.com)
        EMAIL_USER=Your SMTP server user (if using gmail, this will be your gmail)
        EMAIL_PASS=Your SMTP server password (if using gmail, you'll need to generate an application password)

7. Install the application to download dependencies:
        
        npm install
        
8. Run the app.js file:

        node app.js
        
9. Done and done! You can now make http requests to the domain you are using and the PORT and API_BASE_URL you set up on your env file, so if you are running this on your computer you would request to: http://localhost:{PORT}{API_BASE_URL}

## Code Organization

The code is structured and modularized in 4 main layers as follows:

* **Models**: Encapsulates all logic related to defining the data models as **they are persisted in the database**.
* **Repositories**: Encapsulates all logic related to manipulation and access of the data models defined on the Model layer. This includes maintaining data consistency and house keeping.
* **Services**: Encapsulates all business logic. This is the layer where the raw data as it is persisted gets transformed to the exposed one (i.e. Age attributes get calculated, arrays get populated, etc.). The main objective of this is to encapsulate a whole business operation/transaction (which may involve multiple data access or operations) as a unity and to translate it to data management.
* **Controllers**: Encapsulates all request handling. This is were the requests arrive and get handled as it's needed (normally calling one or more services).

The way each layer interacts with each other is shown in the following figure where every arrow is a reference:

![ConSerRepMod](https://i.imgur.com/yxPFw2a.png)

So this way Controller calls to Service, Service may call to other Services and/or a Repository, and Repository may call to other Repositories and/or a Model which in turn access the database and handles its data.

This separation of concerns is very traditional (used quite a bit in Java Spring based systems) and we could argue that the repository layer may not be necessary since Mongoose is providing us with a clear API to access the database through our models. While this is true, in this project we do have documents with references to other documents, and cascading operations are not performed by Mongoose. For this reason I think having that extra layer of logic to handle any kind of cascading or reference change is important and allows for clearer more maintainable code.

## Image storage

I'm currently storing the images in the file system wherever the server is running.

Storing images in the file system?

![ew](https://media1.giphy.com/media/aNtt9T8SqGNK8/giphy.gif?cid=ecf05e47z438tprfv6ux49e8yray5qoonl4ugkzot6xmummj&rid=giphy.gif&ct=g)

I know. This is not optimal for multiple reasons, one is that this makes our solution more tightly coupled: if in the future we change how we store the images or add logic to it (i.g. we save multiple sizes of the same image for thumbnails, etc.), that has to increment the server's code size, complexity, and give an extra responsibility to it and that's no bueno because of maintenance cost, team management, and so on.

Another reason is that if we were to run this app in a cluster of servers with the code as it is, the images are not going to be consistent. Multiple cluster nodes will have (most likely) multiple file systems, and this will mean that if "user x" connects to node 1 of our cluster and creates a post, it will get persisted in the database but the image will be only in node 1's file system, hence when "user y" connects to the node 2 of our cluster and goes to "user x"'s profile, they will see a bunch of broken link images.

In the future I plan to address this by using some cloud store like Amazon S3. That will delegate the storage to amazon and make our app more scalable overall, besides if we consider that this is "Instagram" having to use the file system of our server will make our solution incredibly capped in terms of scalability because of the millions of users, the space we will need and so on, you name it.

## Data model

The data model is very straight forward and clear in the Model layer.
One of the decisions I decided to make was to not keep likes or comments as nested objects. We are not doing this since that would provoke an unbounded growing array in the database, something that is not recommended on mongoDB at least since each document can have at most 16MB, and if we consider that a post may have millions of comments on Instagram this is not something you need or want. Besides we may want to access these comments or likes separately (i.g. to see all user comments for moderation) and this is a good reason to not embed documents on MongoDB.
For these reasons the data model is "normalized" (Breaking the "No Rules" rule of documental and NoSQL databases) or at least to a degree. This will allow more scalability and not overflowing documents.

The following diagram represents these references:

![dataModel](https://i.imgur.com/23fQrVB.png)
