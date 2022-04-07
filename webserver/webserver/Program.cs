using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using Newtonsoft.Json;
using System.Text.RegularExpressions;




namespace BasicWeb
{
    internal class Server
    {


        public static HttpListener listener;
        static HttpClient client= new HttpClient();
        public static string url = "http://192.168.1.69:8000/";
        public static int pageViews = 0;
        public static int requestCount = 0;

       public static Dictionary<string, Pachetto> dataset = new Dictionary<string, Pachetto>();
       public static Pachetto player;


        public Server()
        {
            Start();
        }


        public static async Task HandleIncomingConnections()
        {
            bool runServer = true;
            while (runServer)
            {
                //aspetta il pachetto 
                HttpListenerContext ctx = await listener.GetContextAsync();
                HttpListenerRequest req = ctx.Request;
                HttpListenerResponse resp = ctx.Response;
                HttpClient client = new HttpClient();
                var request = new HttpRequestMessage(HttpMethod.Post,"http://192.168.1.69:8080");


                //var rx = new Regex(@"\b(?<word>\w+)\s+(\k<word>)\b";



                //permesso per inviare il pachetto
                resp.AddHeader("Access-Control-Allow-Origin", "*");
                resp.AddHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
                resp.AddHeader("Access-Control-Allow-Headers", "X-Requested-With");
                resp.AddHeader("Acesss-Control-Max-Age", "86400");
                resp.AddHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");


                //lettura pachetto
                System.IO.Stream body = req.InputStream;
                System.Text.Encoding encoding = req.ContentEncoding;
                System.IO.StreamReader reader = new System.IO.StreamReader(body, encoding);
                string ris = reader.ReadToEnd();

                //Stream st= resp.OutputStream;



                //risposta da fare 


                if (ris != null)
                {
                player = JsonConvert.DeserializeObject<Pachetto>(ris);
                    if (player != null)
                    {
                        if (player.id > 100)
                        {
                            Console.WriteLine(player.persone);
                            player.persone = pageViews;
                            pageViews++;

                        }
                        if (pageViews > 0) dataset.Remove("200");



                        Console.WriteLine(player.id.ToString());
                        dataset[player.id.ToString()] = player;
                        string data = System.Text.Json.JsonSerializer.Serialize(dataset);
                        request.Content = new StringContent(data,Encoding.UTF8,"application/json");

                        //invio risposta
                        byte[] buffer = System.Text.Encoding.UTF8.GetBytes(data);
                        resp.ContentType = "application/json";
                        resp.ContentEncoding = Encoding.UTF8;
;


                        await resp.OutputStream.WriteAsync(buffer, 0, buffer.Length);
                    }
                }


                //contolla chi e morto
                foreach (KeyValuePair<string, Pachetto> kvp in dataset)
                {
                    Console.WriteLine("Key: {0}, Value x: {1}, Value y:{2}, vita:{3}", kvp.Key, kvp.Value.posizione[0],kvp.Value.posizione[1],kvp.Value.vivo);
                    float x=kvp.Value.posizione[0];
                    float y = kvp.Value.posizione[1];
                    float vx=kvp.Value.velocity[0];
                    float vy = kvp.Value.velocity[1];

                    foreach (KeyValuePair<string, Pachetto> kvp2 in dataset)
                        if(x==kvp2.Value.posizione[0]&&y==kvp2.Value.posizione[1])
                        {
                            if (vx > kvp2.Value.velocity[0] || vy > kvp2.Value.velocity[1])
                                dataset[kvp2.Key].vivo = false;
                        }
                }




                    resp.Close();

            }
        }




        public void Start()
        {
            listener = new HttpListener();
            listener.Prefixes.Add(url);
            listener.Start();
            Console.WriteLine("server partito in {0}", url);

            Task listenTask = HandleIncomingConnections();
            listenTask.GetAwaiter().GetResult();

 
            listener.Close();
        }

    }
}

