using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.Storage; // Namespace for CloudStorageAccount
using Microsoft.WindowsAzure.Storage.Table; // Namespace for Table storage types
using System.Web.Configuration;

namespace SampleSite1.storage
{

    public class BlogItemEntity: TableEntity, IBlogItem
    {
        public BlogItemEntity(string id)
        {
            PartitionKey = "item";
            RowKey = id;
        }

        public BlogItemEntity()
        {

        }

        [IgnoreProperty]
        public string id { get { return RowKey; } set { RowKey = value; } }

        public string title { get; set; }
        public string description { get; set; }
        public DateTime date { get; set; }
        public string contentHTML { get; set; }
        public string headlinePhotoURL { get; set; }
    }

    public interface IBlogItem
    {
        string id { get; set; }
        string title { get; set; }
        string description { get; set; }
        DateTime date { get; set; }
        string contentHTML { get; set; }
        string headlinePhotoURL { get; set; }
    }

    public class BlogItem: IBlogItem
    {
        public string id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public DateTime date { get; set; }
        public string contentHTML { get; set; }
        public string headlinePhotoURL { get; set; }
    }
}