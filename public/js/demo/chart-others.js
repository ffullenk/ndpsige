$(function(){function r(){e.length>0&&(e=e.slice(1));while(e.length<t){var n=e.length>0?e[e.length-1]:50,r=n+Math.random()*10-5;r<0?r=5:r>50&&(r=50),e.push(r)}var i=[];for(var s=0;s<e.length;++s)i.push([s,e[s]]);return i}function m(e,t){return Math.floor(Math.random()*(t-e+1)+e)}var e=[],t=300,n=300,i=$.plot("#chart-realtime",[{data:r(),color:"#1BA1E2"}],{legend:{show:!1},xaxis:{show:!1},yaxis:{show:!1},series:{shadowSize:0,lines:{fill:.8}},grid:{backgroundColor:"transparent",borderWidth:0}}),s=function(){i.setData([{data:r(),color:"#1BA1E2"}]),i.draw(),setTimeout(s,n)};s();var o=[{xScale:"ordinal",comp:[],main:[{className:".main.l1",data:[{y:15,x:"2012-11-19T00:00:00"},{y:11,x:"2012-11-20T00:00:00"},{y:8,x:"2012-11-21T00:00:00"},{y:10,x:"2012-11-22T00:00:00"},{y:1,x:"2012-11-23T00:00:00"},{y:6,x:"2012-11-24T00:00:00"},{y:8,x:"2012-11-25T00:00:00"}]},{className:".main.l2",data:[{y:29,x:"2012-11-19T00:00:00"},{y:33,x:"2012-11-20T00:00:00"},{y:13,x:"2012-11-21T00:00:00"},{y:16,x:"2012-11-22T00:00:00"},{y:7,x:"2012-11-23T00:00:00"},{y:18,x:"2012-11-24T00:00:00"},{y:8,x:"2012-11-25T00:00:00"}]}],type:"line-dotted",yScale:"linear"},{xScale:"ordinal",comp:[],main:[{className:".main.l1",data:[{y:12,x:"2012-11-19T00:00:00"},{y:18,x:"2012-11-20T00:00:00"},{y:8,x:"2012-11-21T00:00:00"},{y:7,x:"2012-11-22T00:00:00"},{y:6,x:"2012-11-23T00:00:00"},{y:12,x:"2012-11-24T00:00:00"},{y:8,x:"2012-11-25T00:00:00"}]},{className:".main.l2",data:[{y:29,x:"2012-11-19T00:00:00"},{y:33,x:"2012-11-20T00:00:00"},{y:13,x:"2012-11-21T00:00:00"},{y:16,x:"2012-11-22T00:00:00"},{y:7,x:"2012-11-23T00:00:00"},{y:18,x:"2012-11-24T00:00:00"},{y:8,x:"2012-11-25T00:00:00"}]}],type:"cumulative",yScale:"linear"},{xScale:"ordinal",comp:[],main:[{className:".main.l1",data:[{y:12,x:"2012-11-19T00:00:00"},{y:18,x:"2012-11-20T00:00:00"},{y:8,x:"2012-11-21T00:00:00"},{y:7,x:"2012-11-22T00:00:00"},{y:6,x:"2012-11-23T00:00:00"},{y:12,x:"2012-11-24T00:00:00"},{y:8,x:"2012-11-25T00:00:00"}]},{className:".main.l2",data:[{y:29,x:"2012-11-19T00:00:00"},{y:33,x:"2012-11-20T00:00:00"},{y:13,x:"2012-11-21T00:00:00"},{y:16,x:"2012-11-22T00:00:00"},{y:7,x:"2012-11-23T00:00:00"},{y:18,x:"2012-11-24T00:00:00"},{y:8,x:"2012-11-25T00:00:00"}]}],type:"bar",yScale:"linear"}],u=[0,1,0,2],a=0,f=d3.time.format("%A"),l=new xChart("line-dotted",o[u[a]],"#xchart",{axisPaddingTop:5,dataFormatX:function(e){return new Date(e)},tickFormatX:function(e){return f(e)},timing:1250}),c=d3.selectAll(".multi button"),h=3500,p=function(e){var t=o[e];return l.setData(t),c.classed("toggled",function(){return d3.select(this).attr("data-type")===t.type}),t},d=function(){a+=1,a=a>=u.length?0:a;var e=p(u[a]);v=setTimeout(d,h)},v=setTimeout(d,h);$(".chart-pie").easyPieChart({animate:2e3,size:150});var g=function(){$(".chart-pie").each(function(){var e=m(30,95);$(this).data("easyPieChart").update(e),$(this).find(".easypie-text").text(e+"%")}),setTimeout(g,7e3)};g(),$("#easypie-custom1").easyPieChart({animate:2e3,barColor:"#E51400",trackColor:"#f3f3f3",scaleColor:!1,lineCap:"butt",lineWidth:20,size:150}),$("#easypie-custom2").easyPieChart({animate:2e3,barColor:"#76608A",trackColor:"#f3f3f3",scaleColor:"#dfe0e0",lineCap:"round",lineWidth:20,size:150}),$("#easypie-custom3").easyPieChart({animate:2e3,barColor:"#F472D0",trackColor:"#f3f3f3",scaleColor:!1,lineCap:"square",lineWidth:20,size:150}),$("#easypie-custom4").easyPieChart({animate:2e3,barColor:"#E3C800",trackColor:"#f3f3f3",scaleColor:"#dfe0e0",lineCap:"round",lineWidth:20,size:150})});