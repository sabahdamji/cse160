class Camera{
    constructor(){
        this.eye = new Vector3([0,0,6.5]);
        this.at = new Vector3([0,0,-90]);
        this.up = new Vector3([0,1,0]);
    }
forward(){
    var atNew = new Vector3(this.at.elements);
    var eyeNew = new Vector3(this.eye.elements);
    var f = atNew.sub(eyeNew).normalize();
    this.eye = this.eye.add(f);
    this.at = this.at.add(f);
}
back(){
    var atNew = new Vector3(this.at.elements);
        var eyeNew = new Vector3(this.eye.elements);
        var f = atNew.sub(eyeNew).normalize();
        this.at = this.at.sub(f);
        this.eye = this.eye.sub(f);
}
left(){
    var atNew = new Vector3(this.at.elements);
    var eyeNew = new Vector3(this.eye.elements);
    var f = atNew.sub(eyeNew).normalize().mul(-1);
    var s = Vector3.cross(f, this.up).normalize();
    this.at = this.at.add(s);
    this.eye = this.eye.add(s);
}
right(){
    var atNew = new Vector3(this.at.elements);
    var eyeNew = new Vector3(this.eye.elements);
    var f = atNew.sub(eyeNew).normalize();
    var r = Vector3.cross(f, this.up).normalize();
    this.at = this.at.add(r);
    this.eye = this.eye.add(r);
}

}