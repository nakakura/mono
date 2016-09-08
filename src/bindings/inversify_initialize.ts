import { Kernel } from "inversify";
import { decorate, injectable, inject, interfaces } from "inversify";
import getDecorators from "inversify-inject-decorators";
import { makeProvideDecorator } from "inversify-binding-decorators";

let kernel = new Kernel();
let {lazyInject} = getDecorators(kernel);
let provide = makeProvideDecorator(kernel);

export { kernel, lazyInject, provide };
