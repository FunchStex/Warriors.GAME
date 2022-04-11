using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BasicWeb
{
    internal class Pachetto
    {
        public float[] posizione { get; set; }
        public float[] velocity { get; set; }
        public int id { get; set; }
        public int vivo { get; set; } = 2;
        public int persone {  get; set; }
        public bool apple { get; set; } = false;
        public float applex { get; set; }
        public float appley { get; set; }
        public bool Colpito { get; set; } = true;
        public float Time { get; set; } = 5;


    }
}
