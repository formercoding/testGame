<template>
    <div class="uploadpic">
        <input type="file"
               accept="image/png,image/jpg,image/jpeg"
               class="file"
               @change="getSignature($event)">
        <button type="button"
                :disabled="disabled"
                class="btn">
                上传图片
        </button>
    </div>
</template>

<script>
import Idouzi from '@idouzi/idouzi-tools'
import Tool from './../common/common.js'

export default {
    props: {
        flag: {
            type: Number,
            default: 0
        }
    },

    data() {
        let ajaxUrl = {
                getSignature: Tool.editUrl('/supplier/sign-medialibs')
            };

        ajaxUrl.uploadPic = 'http://medialibs-';
        // 环境检测
        switch(Idouzi.getEnv()) {
            case 'dev': {
                url += 'dev';
                break;
            }
            case 'test': {
                ajaxUrl.uploadPic += 'wx';
                break;
            }
            case 'prod': {
                ajaxUrl.uploadPic += 'qq';
                break;
            }
            default: ajaxUrl.uploadPic += 'dev';
        }

        ajaxUrl.uploadPic += '.idouzi.com/api/upload'

        return {
            ajaxUrl: ajaxUrl, // ajax地址
            disabled: false, // 上传按钮状态
            signature: '', // 商家签名 
            limit: 1000, // 图片上传限制
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
                signature = unescape(window.sessionStorage.signature), // 没有为undefined
                overdure = curTime - window.sessionStorage.signatureTime;

            // 读session中的签名是否存在 undefined -> string
            if(signature !== 'undefined') {
                signature = JSON.parse(signature);
            }

            // 按钮禁用
            _this.disabled = 'disabled';

            // 判断签名是否过期
            if(signature && overdure < 9 * 60 * 1000) {
                _this.signature = signature;
                _this.uploadPic(event);
                return true;
            }

            // 获取签名请求
            _this.$http.get(_this.ajaxUrl.getSignature).then((res) => {
                let data = res.data;
                // 获取签名成功
                if(data.return_code === 'SUCCESS') {
                    let signature = data.return_msg.params;
                    
                    _this.signature = signature;
                    sessionStorage.signature = escape(JSON.stringify(signature));
                    sessionStorage.signatureTime = new Date().getTime();

                    _this.uploadPic(event);
                } else {
                    _this.$message({
                        message: data.return_msg,
                        duration: 2000
                    });
                    _this.disabled = false;
                }
            }).catch( (error) => {
                // 网络错误
                if(error.response) {
                    this.$message({
                        message: error.response.status + ':网络错误，请刷新重试',
                        duration: 2000
                    });
                } else { // 请求错误
                    this.$message({
                        message: '请求错误，请刷新重试',
                        duration: 2000
                    });
                }

                _this.disabled = false;
            });
        },

        /**
         * 上传图片
         * @param {Element} event 当前按钮的节点
         */
        uploadPic(event) {
            let _this = this,
                target = event.target,
                file = target.files[0];

                // 如果没有选择图片则退出
                if(file === undefined) {
                    _this.disabled = false;
                    return false;
                }

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

            // 上传图片
            _this.$http({
                url: _this.ajaxUrl.uploadPic,
                method: 'post',
                params: _this.signature,
                data: formData
            }).then((res) => {
                let data = res.data;
                
                if(data.return_code === 'SUCCESS') {
                    let url = data.return_msg.accessUrl;

                    _this.$emit('upload', _this.flag, url);
                } else {
                    _this.$message(data.return_msg);
                }

                _this.disabled = false;
            }).catch((res) => {
                // 网络错误
                if(error.response) {
                    this.$message({
                        message: error.response.status + ':网络错误，请刷新重试',
                        duration: 2000
                    });
                } else { // 请求错误
                    this.$message({
                        message: '请求错误，请刷新重试',
                        duration: 2000
                    });
                }

                _this.disabled = false;
            });
        }
    }
}
</script>

<style lang="less" scoped>
    /* 主题颜色 */
    @color: #FF981A;
    
    .uploadpic {
        position: relative;
        display: inline-block;
        overflow: hidden;

        .file {
            position: absolute;
            left: -80px;
            top: 0;
            width: 160px;
            height: 32px;
            opacity: 0;
            cursor: pointer;
        }

        .btn {
            width: 80px;
            height: 32px;
            padding: 0;
            color: #fff;
            border: none;
            border-radius: 3px;
            outline: none;
            background: @color;

            &:disabled {
                background: #f7f7f7;
                border: 1px solid #ccc;
                color: #999;
            }
        }
    }
</style>