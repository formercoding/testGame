<template>
    <div class="uploadpic">
        <input type="file" class="file" @change="uploadPic($event)" :disabled="disabled">
        <button type="button"
                class="btn">
                {{txt}}
        </button>
    </div>
</template>
<script>
import Idouzi from '@idouzi/idouzi-tools'
export default {
    props: {
        txtType: {
            type: Number,
            default: 0
        },
        flag: {
            type: Number,
            default: 0
        }
    },

    data() {
        let ajaxUrl = {};
        // 环境检测
        switch(Idouzi.getEnv()) {
            case 'dev': {
                ajaxUrl = {
                    getSignature: 'http://qa-dev.idouzi.com/supplier/sign-medialibs',
                    uploadPic: 'http://medialibs-dev.idouzi.com/api/upload'
                }
            }
            case 'test': {
                ajaxUrl = {
                    getSignature: 'http://qa-wx.idouzi.com/supplier/sign-medialibs',
                    uploadPic: 'http://medialibs-wx.idouzi.com/api/upload'
                }
            }
            case 'prod': {
                ajaxUrl = {
                    getSignature: 'http://qa-qq.idouzi.com/supplier/sign-medialibs',
                    uploadPic: 'http://medialibs-qq.idouzi.com/api/upload'
                }
            }
            default: {
                ajaxUrl = {
                    getSignature: 'http://qa-dev.idouzi.com/supplier/sign-medialibs',
                    uploadPic: 'http://medialibs-dev.idouzi.com/api/upload'
                }
            }
        }
        return {
            ajaxUrl: ajaxUrl, // ajax地址
            disabled: false, // 上传按钮状态
            signature: '', // 商家签名 
            limit: 1000, // 图片上传限制
            txts: ['上传图片', '选择图片'] 
        }
    },

    computed: {
    },

    created() {

    },
    
    computed: {
        txt() {
            return this.txts[this.txtType];
        }
    },

    methods: {
        /**
         * 获取用户签名
         * @return {Boolean} true:获取签名成功 false:获取签名失败
         */
        getSignature() {
            let _this = this,
                curTime = new Date().getTime(),
                signature = window.sessionStorage.signature,
                overdure = curTime - window.sessionStorage.signatureTime;
            
            // 按钮禁用
            _this.disabled = 'disabled';

            // 判断签名是否过期
            if(signature && overdure < 9 * 60 * 1000) {
                return true;
            }

            // 获取签名请求
            _this.$http.post(_this.ajaxUrl.getSignature).then((res) => {
                let data = res.data;

                // 获取签名成功
                if(data.return_code === 'SUCCESS') {
                    let signature = data.return_msg.params;

                    _this.signature = signature;
                    window.sessionStorage.signature = signature;
                    window.sessionStorage.signatureTime = new Date().getTime();

                    return true;
                }
            }, (res) => {
                // 获取签名失败提示
                _this.$message({
                    message: '获取签名失败',
                    duration: 0
                });
                return false;
            });
        },

        /**
         * 上传背景图片
         * @param {Element} event 当前按钮的节点
         */
        uploadPic(event) {
            let _this = this,
                target = event.target,
                file = target.files[0];
            
            // 没有签名则退出
            if(!_this.getSignature()) {
                return false;
            } else {

                // 图片大小限制 1000个字节
                if(file.size > _this.limit * 1024) {
                    _this.$message('选择图片大小超过限制');
                    return false;
                }

                _this.uploadImage(file, target);

                console.log(_this.signature);
            }
        },

        /**
         * 上传图片
         * @param {Object} file 文件file对象
         */
        uploadImage(file, target) {
            let _this = this,
                formData = new FormData(),
                reg = /^(\s|\S)+(jpg|png|jpeg|bmp)+$/;

            let imgType = file.type;

            // 格式检查
            if (!reg.test(imgType.toLowerCase())) {
                _this.$message('仅支持图片格式：jpg、jpeg、png、bmp');
                return false;
            }

            formData.append('file', file);

            // 上传图片
            _this.$http.post(_this.ajaxUrl.uploadPic + _this.signature, formData).then((res) => {
                _this.$emit('upload', _this.flag, 'http://img.redocn.com/sheying/20151230/xiajiahejingguandaifengjingsheyingtupian_5693692.jpg');
                console.log(res);
            }, (res) => {
                _this.$message('上传图片失败');
                // 获取签名失败提示
                _this.$message({
                    message: '获取签名失败',
                    duration: 0
                });
            });
        }
    }
}
</script>
<style lang="less" scoped>
    .uploadpic {
        position: relative;
        display: inline-block;

        .file {
            position: absolute;
            top: 0;
            width: 80px;
            height: 32px;
            opacity: 0;
        }

        .btn {
            width: 80px;
            height: 32px;
            padding: 0;
            color: #fff;
            border: none;
            border-radius: 3px;
            outline: none;
            background: #ff981a;

            &.disabled {
                background: #fff;
            }
        }
    }

</style>


