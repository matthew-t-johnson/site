using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Azure; // Namespace for CloudConfigurationManager
using Microsoft.WindowsAzure.Storage; // Namespace for CloudStorageAccount
using Microsoft.WindowsAzure.Storage.Table; // Namespace for Table storage types
using System.Web.Configuration;



namespace SampleSite1.storage
{
    public class BlogItems
    {

       // private readonly CloudStorageAccount storageAccount = CloudStorageAccount.Parse(WebConfigurationManager.AppSettings["StorageConnectionString"]);
        private readonly CloudTableClient tableClient;
        private readonly CloudTable table;

        public BlogItems()
        {
            var connectionString = WebConfigurationManager.AppSettings["StorageConnectionString"];

            var storageAccount = CloudStorageAccount.Parse(connectionString);
            // Create the table client.
            tableClient = storageAccount.CreateCloudTableClient();

            // Retrieve a reference to the table.
            table = tableClient.GetTableReference("blogItems");

            // Create the table if it doesn't exist.
            if(table.CreateIfNotExists())
            {
                LoadTestData();
            }
        }

        public IEnumerable<IBlogItem> GetAll()
        {
            TableQuery<BlogItemEntity> query = new TableQuery<BlogItemEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "item"));
            return table.ExecuteQuery(query);
        }

        public IBlogItem GetOne(string id)
        {
            TableOperation retrieveOperation = TableOperation.Retrieve<BlogItemEntity>("item", id);
            return table.Execute(retrieveOperation).Result as IBlogItem;
        }

        public IBlogItem AddOne(BlogItemEntity item)
        {
            TableOperation insertOperation = TableOperation.Insert(item);

            // Execute the operation.
            return table.Execute(insertOperation).Result as IBlogItem;
        }

        private void LoadTestData()
        {
            var blogItems = new[] {
                new BlogItemEntity("1") {
                    title = "Initial Post",
                    description = "This is an initial post.",
                    date = new DateTime(2017, 3, 12, 3, 12, 15),
                    contentHTML = "<p>This is some sample content for the sample initial post 1</p>"
                },
                new BlogItemEntity("2") {
                    title = "Initial Post 2",
                    description = "This is an initial post 2.",
                    date = new DateTime(2017, 3, 11, 4, 11, 20),
                    contentHTML = "<p>This is some sample content for the sample initial post 1</p>"
                },
                new BlogItemEntity("3") {
                    title = "Initial Post",
                    description = "This is an initial post 3.",
                    date = new DateTime(2017, 3, 10, 5, 20, 30),
                    contentHTML = "<p>This is some sample content for the sample initial post 1</p>"
                }
            };

            foreach(var item in blogItems)
            {
                AddOne(item);
            }
        }
    }
}

