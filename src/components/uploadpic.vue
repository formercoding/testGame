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
        data: Object
    },

    data() {
        return {
            url: 'ss' // 图片上传地址
        }
    },
    
    computed: {
        txt() {
            let pos = this.data.pos,
                txt = '上传图片';

            if(pos === 'gameBase') {
                txt = '选择图片';
            }

            return txt;
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

            // 上传图片
            _this.$http.post(_this.url, formData).then((res) => {
                _this.urlStr = res.url;
            }, () => {
                // 错误提示
                console.log(formData.has('file'));
                console.log('上传失败');
                // 广播
                // _this.$emit('uploadPic', _this.data.flag, 'http://img.redocn.com/sheying/20151230/xiajiahejingguandaifengjingsheyingtupian_5693692.jpg')
                _this.changePic('http://img.redocn.com/sheying/20151230/xiajiahejingguandaifengjingsheyingtupian_5693692.jpg');
            });
        },

        /**
         * 上传成功后修改预览图片
         * @param {String} url 图片地址
         */
        changePic(url) {
            let pos = this.data.pos,
                flag = this.data.flag;
            console.log(pos, flag, url);
            // 根据按钮位置执行不同的commit
            switch(pos) {
                case 'gameBase': {
                    if(flag === 'index') {
                        this.$store.commit('changeIndexPic', url);
                    } else {
                        this.$store.commit('changeSharePic', url);
                    }
                    break;
                }
                case 'gameQuestions': {
                    this.$store.commit('changeQuestionsPic', {index: flag, url: url});
                    break;
                }
                case 'gameResults': {
                    this.$store.commit('changeResultsPic', {index: flag, url: url});
                    break;
                }
            }
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


