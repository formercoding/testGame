<template>
    <div class="uploadpic">
        <input type="file" class="file" @change="getSignature($event)" :disabled="disabled">
        <button type="button"
                :style="btnStyle"
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
                break;
            }
            case 'test': {
                ajaxUrl = {
                    getSignature: 'http://qa-wx.idouzi.com/supplier/sign-medialibs',
                    uploadPic: 'http://medialibs-wx.idouzi.com/api/upload'
                }
                break;
            }
            case 'prod': {
                ajaxUrl = {
                    getSignature: 'http://qa-qq.idouzi.com/supplier/sign-medialibs',
                    uploadPic: 'http://medialibs-qq.idouzi.com/api/upload'
                }
                break;
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
        }
    },

    computed: {
        // 按钮上传图片样式
        btnStyle() {
            if(this.disabled === 'disabled') {
                return {
                    background: '#f7f7f7',
                    border: '1px solid #ccc',
                    color: '#999'
                }
            } else {
                return {
                }
            }
        },

        txt() {
            if(this.disabled === 'disabled') {
                return '上传中'
            } else {
                return '上传图片'
            }
        }
    },

    methods: {
        /**
         * 获取用户签名
         * @return {Boolean} true:获取签名成功 false:获取签名失败
         */
        getSignature(event) {
            let _this = this,
                curTime = new Date().getTime(),
                signature = window.sessionStorage.signature,
                overdure = curTime - window.sessionStorage.signatureTime;
            
            // 按钮禁用
            _this.disabled = 'disabled';

            // 判断签名是否过期
            if(signature && overdure < 9 * 60 * 1000) {
                _this.signature = signature;
                _this.uploadPic(event);
                return true;
            }

            // 获取签名请求
            _this.$http.post(_this.ajaxUrl.getSignature).then((res) => {
                let data = res.data;
                // 获取签名成功
                if(data.return_code === 'SUCCESS') {
                    let signature = data.return_msg.params;
                    
                    _this.signature = JSON.stringify(signature);
                    window.sessionStorage.signature = signature;
                    window.sessionStorage.signatureTime = new Date().getTime();

                    _this.uploadPic(event);
                }
            }, (res) => {

                // 获取签名失败提示
                _this.$message({
                    message: '获取签名失败',
                    duration: 2000
                });

                _this.disabled = false;
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

                console.log(target, 'dddddddddddevetn');

                // 图片大小限制 1000个字节
                if(file.size > _this.limit * 1024) {
                    _this.$message('选择图片大小超过限制');
                    return false;
                }

                _this.uploadImage(file, target);
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
                _this.disabled = false;
                return false;
            }

            formData.append('file', file);
            console.log(formData);
            // 上传图片
            _this.$http({
                url: _this.ajaxUrl.uploadPic,
                method: 'post',
                params: JSON.parse(_this.signature),
                data: formData
            }).then((res) => {
                let data = res.data;
                
                if(data.return_code === 'SUCCESS') {
                    let url = data.return_msg.accessUrl;

                    _this.$emit('upload', _this.flag, url);
                }

                _this.disabled = false;
                
            }, (res) => {
                // 获取签名失败提示
                _this.$message({
                    message: '上传图片失败',
                    duration: 2000
                });

                _this.disabled = false;
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


