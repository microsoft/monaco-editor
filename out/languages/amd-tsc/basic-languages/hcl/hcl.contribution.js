define(["require","exports","../_.contribution"],(function(e,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),(0,r.registerLanguage)({id:"hcl",extensions:[".tf",".tfvars",".hcl"],aliases:["Terraform","tf","HCL","hcl"],loader:function(){return AMD?new Promise((function(n,r){e(["vs/basic-languages/hcl/hcl"],n,r)})):new Promise((function(n,r){e(["./hcl"],n,r)}))}})}));