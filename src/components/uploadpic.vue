<template>
    <div class="uploadpic">
        <input type="file" class="file" @change="uploadPic($event)">
        <button type="button" 
                class="btn">
                {{txt}}
        </button>
    </div>
</template>
<script>
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
        return {
            ajaxUrl: 'http://medialibs-dev.idouzi.com/api/upload',
            limit: 1000, // 图片上传限制
            url: 'ss', // 图片上传地址
            txts: ['上传图片', '选择图片'] 
        }
    },
    
    computed: {
        txt() {
            return this.txts[this.txtType];
        }
    },

    methods: {
        /**
         * 上传背景图片
         * @param {Element} event 当前按钮的节点
         */
        uploadPic(event) {
            let _this = this,
                target = event.target,
                file = target.files[0];
            
            // 图片大小限制
            if(file.size > _this.limit * 1024) {
                alert('选择图片大小超过限制');
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
                alert('仅支持图片格式：jpg、jpeg、png、bmp');
                return false;
            }

            formData.append('data', file);

            // 获取签名
             _this.$http.post('http://qa-dev.idouzi.com/supplier/sign-medialibs').then((res) => {
                console.log('res', res);
            }, (res) => {
                console.log('res', res)
                _this.$emit('upload', _this.flag, 'http://img.redocn.com/sheying/20151230/xiajiahejingguandaifengjingsheyingtupian_5693692.jpg');
            });

            // 上传图片
            // _this.$http.post(_this.ajaxUrl, formData).then((res) => {
            //     _this.urlStr = res.url;
            // }, (res) => {
            //     _this.$emit('upload', _this.flag, 'http://img.redocn.com/sheying/20151230/xiajiahejingguandaifengjingsheyingtupian_5693692.jpg');
            // });
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


