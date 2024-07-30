import { _decorator, Component, Node, SpriteComponent, tween, Vec3, v3, resources, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NumberSprite')
export class NumberSprite extends Component {

    private sprite:SpriteComponent;

    public async setImage(imgNumber:number)
    {
        if(this.sprite == null){
            this.sprite = this.node.getComponent(SpriteComponent);
        }
        //2->精灵->设置到Image中
        let path = "Sprites/2048Atlas_" + imgNumber + "/spriteFrame";
        this.sprite.spriteFrame = await this.loadSprite(path);
    }

    public loadSprite(path: string) {
        return new Promise<SpriteFrame>((resolve, reject) => {
            if (path == "") {
                reject("path is null");
                return;
            }
            resources.load(path, SpriteFrame, (err, sprite: SpriteFrame) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (sprite) {
                    resolve(sprite);
                    return;
                }
                reject(err);
                return;
            })
        });
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


