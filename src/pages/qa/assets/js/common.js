import Idouzi from '@idouzi/idouzi-tools'

/**
 * 根据不同环境修改ajax地址
 * @param {String} briefUrl 请求地址相对路径
 * @return {String} 根据环境拼接的绝对路径
 */
export default {
    
    /**
     * 环境检查拼接
     * @param {String} brief 请求相对路径
     * @return {String} 不同环境下请求的绝对路径
     */
    editUrl(brief) {
        let baseUrl;

        switch(Idouzi.getEnv()) {
            case 'dev': {
                baseUrl = 'http://qa-dev.idouzi.com';
                break;
            }
            case 'test': {
                baseUrl = 'http://qa-wx.idouzi.com';
                break;                
            }
            case 'prod': {
                baseUrl = 'http://qa-dev.idouzi.com';
                break;                
            }
            default: {
                baseUrl = 'http://qa-dev.idouzi.com';
            }
        }

        return baseUrl + brief;
    }
}
    

