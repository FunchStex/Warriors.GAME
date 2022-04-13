using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BasicWeb
{
    internal class Pachetto
    {
        public float[] posizione { get; set; } = {0,0};
        public float[] velocity { get; set; } = { 0, 0 };
        public int id { get; set; } = 200;
        public int vivo { get; set; } = 2;
        public int persone { get; set; } = 0;
        public bool apple { get; set; } = false;
        public bool Colpito { get; set; } = true;
        public float Time { get; set; } = 10;
        public bool AppleVivo { get; set; } = false;


    }
}
