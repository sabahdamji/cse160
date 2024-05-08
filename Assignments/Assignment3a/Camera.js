class Camera{
    constructor(){
        this.eye = new Vector3([0,0,3]);
        this.at = new Vector3([0,0,-100]);
        this.up = new Vector3([0,1,0]);
    }
forward(){
    var f = this.at.subtract(this.eye);
    f=f.divide(f.length());
    this.at=this.at.add(f);
    this.eye=this.eye.add(f);
}
back(){
    var f = this.eye.subtract(this.at);
    f=f.divide(f.length());
    this.at=this.at.add(f);
    this.eye=this.eye.add(f);
}
left(){
    var f = this.eye.subtract(this.at);
    f=f.divide(f.length());
    var s = f.cross(this.up);
    s=s.divide(s.length());
    this.at=this.at.add(s);
    this.eye=this.eye.add(s);
}
right(){
    var f = this.eye.subtract(this.at);
    f = f.divide(f.length());
    var s = f.cross(this.up);
    s = s.divide(s.length());
    var u = s.cross(f);
    u = u.divide(u.length());
    this.at = this.at.subtract(s); 
    this.eye = this.eye.subtract(s); 
}

}