using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SampleSite1.storage;
using System.Text.RegularExpressions;

namespace SampleSite1.Controllers
{
    public class BlogController : ApiController
    {
        // GET: api/Blog
        public IEnumerable<IBlogItem> Get()
        {
            return new BlogItems().GetAll();
        }

        // GET: api/Blog/5
        public IBlogItem Get(string id)
        {
            return new BlogItems().GetOne(id);
        }

        // POST: api/Blog
        public string Post([FromBody]BlogItem item)
        {
            var id = Regex.Replace(item.title, @"\W", string.Empty);
            if (Get(id) == null)
            {
                item.id = id;
                var entity = new BlogItemEntity(id)
                {
                    title = item.title,
                    description = item.description,
                    contentHTML = item.contentHTML,
                    headlinePhotoURL = item.headlinePhotoURL,
                    date = item.date
                };
                return new BlogItems().AddOne(entity).id;
            }

            return null;
        }

        // PUT: api/Blog/5
        public void Put(string id, [FromBody]string value)
        {
        }

        // DELETE: api/Blog/5
        public void Delete(string id)
        {
        }
    }
}
