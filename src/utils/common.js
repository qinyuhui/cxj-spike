export default{
    isdev: function ( env) {
        if(process.env.NODE_ENV=='dev'){
        	 return '/api';  //开发
        }else{
        	return '';  //生产
        }
    },
    env: function ( ) {
    	if(process.env.NODE_ENV=='dev'){
    		return '.html';  //开发
    	}else{
    		return '.shtml';  //生产
    	}
             
             
    },
    ajaxLoading:function () {
      Vue.http.interceptors.push((request, next) => {
  //  help.showLoading = true;
        alert('abcd');
      
        next((response) => {
    //      if(!response.ok){
    //          help.errorCode = response.status
    //          help.showDialog = true
    //      }
    //      help.showLoading = false
    //      return response
        });
      });
    }

    

};