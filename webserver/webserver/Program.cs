using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using System.Net.Sockets;




namespace BasicWeb
{
    internal class Server
    {


        public static HttpListener listener;
        static HttpClient client= new HttpClient();
        public static int pageViews = 0;
        public static int requestCount = 0;

       public static Dictionary<string, Pachetto> dataset = new Dictionary<string, Pachetto>();
       public static Pachetto player;
       public static string url;

        public static bool Spawn=true;
        public static float Timer = 10;
        public static int MeleCount=0;
        public static string html =
            "<!DOCTYPE>" +
            "<html>" +
            "  <head>" +
            "    <title>HttpListener Example</title>" +
            "  </head>" +
            "  <body>" +
            "    <p>Page Views: {0}</p>" +
            "    <form method=\"post\" action=\"shutdown\">" +
            "      <input type=\"submit\" value=\"Shutdown\" {1}>" +
            "    </form>" +
            "  </body>" +
            "</html>";
        public static float[,] _dis=new float[13,13];




        public Server()
        {
            Start();
        }

        public static void SetRandom()
        {
            Random random = new Random();
            Timer = (float)random.NextDouble() * (float)10;
            Timer += 10;
            
        }
        public static void SpawnApple()
        {

            if (MeleCount < 3 && Spawn)
            {
                Random random = new Random();
                Pachetto Mela = new Pachetto();
                string count = (100 + MeleCount).ToString();

                float x = (float)random.NextDouble() * (float)5.4;
                x -= (float)2.8;
                float y = (float)random.NextDouble() * (float)2.25;
                y-= (float)1.25;


                Mela.posizione[0] = x;
                Mela.posizione[1] = y;
                Mela.AppleVivo = true;
                bool keyExists = dataset.ContainsKey(count.ToString());
                if (!keyExists)
                    dataset.Add(count,Mela);

                dataset[count.ToString()] = Mela;

                MeleCount++;
                Console.WriteLine("pozione cambiata x{0},y{1},Mele: {2}", dataset[count].posizione[0], dataset[count].posizione[1], MeleCount);
                Spawn = false;

            }
            else if (dataset.Count>0&&!Spawn)
            {
                dataset["1"].apple = false;
                Spawn = true;
            }else
            {
                MeleCount = 0;
            }
        }
        public static async Task CheckDeath()
        {
             int i = 0;
            foreach (KeyValuePair<string, Pachetto> kvp in dataset)
            {
                float x = kvp.Value.posizione[0];
                float y = kvp.Value.posizione[1];
                float vx = kvp.Value.velocity[0];
                float vy = kvp.Value.velocity[1];


                 int j = 0;
                foreach (KeyValuePair<string, Pachetto> kvp2 in dataset)
                 {
                    if (kvp.Value.id!=200&&kvp2.Value.id!=200)
                    {
                        if (kvp.Key != kvp2.Key)
                        {
                            float x2=kvp2.Value.posizione[0];
                            float y2=kvp2.Value.posizione[1];
                            float vx2=kvp2.Value.velocity[0];
                            float vy2=kvp2.Value.velocity[1];


                            float dis = (float)Math.Sqrt(Math.Pow(x - x2, 2) + Math.Pow(y - y2, 2));
                            _dis[i,j] = dis;
                             if (_dis[i,j] <= 0.08 && ( Math.Abs(vx) > Math.Abs(vx2) || Math.Abs(vy) > Math.Abs(vy2) ))
                             {
                                bool colpito=kvp2.Value.Colpito;
                                if (colpito)                                
                                {
                                    kvp2.Value.Colpito = false;
                                    kvp2.Value.vivo--;
                                    Console.WriteLine(colpito);
                                    Console.Write("in collisione");


                                }
                                Console.WriteLine(kvp.Value.vivo);
                             }
                            Console.WriteLine("id:{0},vita:{1}", kvp.Value.id, kvp.Value.vivo);
                            //if (_dis[i,j] > 0.08)
                            //{
                            //    kvp2.Value.Colpito = true;
                            //    Console.WriteLine(_dis[i,j]);

                            //}

                        }



                    }
                    else if(kvp.Value.id!=200)
                    {
                        float disMela = (float)Math.Sqrt(Math.Pow(x - kvp2.Value.posizione[0], 2) + Math.Pow(y - kvp2.Value.posizione[1], 2));
                        if (disMela < 0.1)
                        {
                            if (kvp.Value.vivo < 3)
                            {
                                kvp.Value.vivo++;
                            }
                                kvp2.Value.AppleVivo = false;
                                kvp2.Value.posizione[0] = 5;
                                kvp2.Value.posizione[1] = 5;
                                Console.WriteLine("viata umentata");

                            
                        }
                    }

                    if (kvp.Value.vivo <= 0&&(kvp.Value.id!=200))
                    {
                        kvp.Value.posizione[0] = 100 + kvp.Value.posizione[0];
                        kvp.Value.posizione[1] = 100 + kvp.Value.posizione[1];
                    }
                    j++;

                }

                    i++;
            }

 
        }
        public static async Task inattivita()
        {
            foreach(KeyValuePair<string, Pachetto> kvp in dataset)
            {
                float x = kvp.Value.posizione[0];
                float y = kvp.Value.posizione[1];
               Task.Delay(20000);
                float newx=kvp.Value.posizione[0];
                float newy = kvp.Value.posizione[1];

                if(x == newx && y == newy)
                {
                    kvp.Value.posizione[0] = 100+kvp.Value.posizione[0];
                    kvp.Value.posizione[1] = 100+kvp.Value.posizione[1];
                }

            }

        }

        public static void calcolo()
        {
            foreach (KeyValuePair<string, Pachetto> kvp in dataset)
            {
                kvp.Value.persone = pageViews;

            }
            if (Timer <= 0)
            {
                SpawnApple();
                SetRandom();
            }
            else Timer -= (float)0.1;
            CheckDeath();

        }
        public static async Task HandleIncomingConnections()
        {
            bool runServer = true;
            SetRandom();
            while (runServer)
            {
                //aspetta il pachetto 
                HttpListenerContext ctx = await listener.GetContextAsync();
                HttpListenerRequest req = ctx.Request;
                HttpListenerResponse resp = ctx.Response;
                var request = new HttpRequestMessage(HttpMethod.Post,url);



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




                if (ris != null)
                {
                player = JsonConvert.DeserializeObject<Pachetto>(ris);
                    if (player != null)
                    {
                        if (player.id > 100)
                        {
                            player.persone = pageViews;
                            pageViews++;

                        }
                        if (pageViews > 0) dataset.Remove("200");



                        dataset[player.id.ToString()] = player;
                        await Task.Run(() =>
                        {
                            calcolo();
                            //inattivita();
                        });
                        bool keyExists = dataset.ContainsKey("1");
                        if (keyExists)
                        {

                        }
                            //Console.WriteLine("la vita di 1 eeeee {0},", dataset["1"].vivo);
                        string data = System.Text.Json.JsonSerializer.Serialize(dataset);
                        request.Content = new StringContent(data,Encoding.UTF8,"application/json");




                        //invio risposta
                        byte[] buffer = System.Text.Encoding.UTF8.GetBytes(data);
                        resp.ContentType = "application/json";
                        resp.ContentEncoding = Encoding.UTF8;


                        await resp.OutputStream.WriteAsync(buffer, 0, buffer.Length);
                    }
 
                    resp.Close();

                }
            }
        }


        public string GetIp()
        {
            string localIP;
            using (Socket socket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, 0))
            {
                socket.Connect("8.8.8.8", 65530);
                IPEndPoint endPoint = socket.LocalEndPoint as IPEndPoint;
                localIP = endPoint.Address.ToString();
            }
            localIP = "http://" + localIP + ":8000/";
            return localIP;
        }

        public void Start()
        {
            url=GetIp();
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

