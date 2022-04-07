using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Text;
using System.Net.Http;
namespace BasicWeb
{
	public partial class Panel
	{
		Server serverObject;
		
		public Panel()
		{
			Console.WriteLine("Start Server");
			serverObject = new Server();
			
        
		}

		static void Main()
        {
			List();

			Panel panel = new Panel();
			
        }


		static void List()
		{
			using (var client = new HttpClient())
			{
				var endpoint = new Uri("https://jsonplaceholder.typicode.com/posts");
				var newpost = new Pachetto()
				{
                    posizione =new float[]{0,0},
					velocity = new float[] { 0, 0 }
				};
				var newpostjson=JsonConvert.SerializeObject(newpost);
				var payload = new StringContent(newpostjson,Encoding.UTF8,"application/json");
				var result = client.PostAsync(endpoint, payload).Result.Content.ReadAsStringAsync().Result;


			}

		}
	}

}
