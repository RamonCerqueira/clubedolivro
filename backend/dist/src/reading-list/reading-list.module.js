"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadingListModule = void 0;
const common_1 = require("@nestjs/common");
const reading_list_controller_1 = require("./reading-list.controller");
const reading_list_service_1 = require("./reading-list.service");
const prisma_module_1 = require("../prisma/prisma.module");
let ReadingListModule = class ReadingListModule {
};
exports.ReadingListModule = ReadingListModule;
exports.ReadingListModule = ReadingListModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [reading_list_controller_1.ReadingListController],
        providers: [reading_list_service_1.ReadingListService],
        exports: [reading_list_service_1.ReadingListService],
    })
], ReadingListModule);
//# sourceMappingURL=reading-list.module.js.map