import { _decorator, Component, Node, SpriteComponent, tween, Vec3, v3, resources } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NumberSprite')
export class NumberSprite extends Component {

    private sprite:SpriteComponent;

    onLoad()
    {
        this.sprite = this.node.getComponent(SpriteComponent);
    }

    public setImage(imgNumber:number)
    {
        //2->精灵->设置到Image中
        resources.load("");
        // this.sprite.spriteFrame = ResourceManager.LoadSprite(imgNumber);
    }

    //移动 合并 生成效果
    public createEffect()
    {
        //小->大        0->1
        tween(this.node).set({scale:Vec3.ZERO}).to(0.3,{scale:Vec3.ONE}, {easing:'backOut'}).start();
    }

    public createEffect2()
    {
        tween(this.node).set({scale:v3(1.2,1.2,1.2)}).to(0.3,{scale:Vec3.ONE},{easing:'backOut'}).start();
    }
}


