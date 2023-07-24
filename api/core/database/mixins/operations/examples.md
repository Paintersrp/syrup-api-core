```bash
// Assume we have an instance of SyDatabase
const syDatabase = new SyDatabase(config, logger, queriesLogger);

// Define some operations that we want to perform in a transaction
const createUser = async (transaction) => {
   await syDatabase.database.models.User.create({ name: 'John Doe' }, { transaction });
};

const createPost = async (transaction) => {
   await syDatabase.database.models.Post.create({ title: 'First Post', content: 'Hello world!' }, { transaction });
};

const updatePost = async (transaction) => {
   await syDatabase.database.models.Post.update({ title: 'Updated Post' }, { where: { title: 'First Post' } }, { transaction });
};

const deletePost = async (transaction) => {
   await syDatabase.database.models.Post.destroy({ where: { title: 'Updated Post' } }, { transaction });
};

const operations = [createUser, createPost, updatePost, deletePost];

// Perform the operations in a single transaction
syDatabase.performBulkOperations(operations).catch((error) => {
  console.error('An error occurred:', error);
});

```
