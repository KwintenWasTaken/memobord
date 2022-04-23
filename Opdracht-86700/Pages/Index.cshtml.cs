using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Hosting; // voor IWebHostEnvironment
using System.Text.Json;

namespace Opdracht_86700.Pages
{
    public class IndexModel : PageModel
    {

        // variabelen
        public string memos;
        private IWebHostEnvironment _environment;

        public IndexModel(IWebHostEnvironment environment)
        {
            _environment = environment;
        }
        public void OnGet()
        {

        }

        public JsonResult OnGetMemo()
        {
            memos = System.IO.File.ReadAllText(
                System.IO.Path.Combine(_environment.WebRootPath, "memos/memos.json"));
            return new JsonResult(memos);
        }

        public JsonResult OnGetVerwerk(string memoData)
        {
            System.IO.File.WriteAllText(
                System.IO.Path.Combine(_environment.WebRootPath, "memos/memos.json"), memoData);
            return new JsonResult(memoData);
        }
    }
}
