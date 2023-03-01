// const crypto = require("crypto");

class tracking
{ 
    constructor() 
    {
        this.m_cmsPhase             = "BETA"; // BETA - GOLD
        this.m_omsVersion           = "0.1.1";
        this.m_ggi_BETA             = 84931;
        this.m_ggi_GOLD             = 84933;
        this.campaign_id_BETA       = 1001;
        this.creative_id_BETA       = 2001;
        this.campaign_id_GOLD       = 9001;
        this.creative_id_GOLD       = 8001;
        this.apiUrl_BETA            = `https://ets-beta.kinder.com`;
        this.apiUrl_GOLD            = `https://ets.kinder.com/`;

        this.m_uuid                 = null;
        this.m_session_id           = null;
        this.m_visit_id             = null;
        this.m_ip_country           = null;
        this.m_mgp_code             = null;
        this.m_ident_id             = null;
        this.m_pack_name            = null;
        this.m_os                   = null;

        this.m_token                = 1;
        this.LAUNCH_RESUME          = 411034;
        this.QR_ACTION              = 426050;

        this.time_between_session   = 0;
        this.acceptCookie           = true;

        this.m_launch_source = '';
    }

    async Init()
    {
        // UserID
        this.m_uuid = this.LoadUserID();
        if(this.m_uuid != null)
        {
            console.log("localstorage UUID = " + this.m_uuid)
        }
        else
        {
            this.m_uuid = this.GetUDID();
            console.log("UUID = " + this.m_uuid)
            this.SaveUserID(this.m_uuid);
        }

        console.log("============ COOKIES ============")
        let group = this.GetCookies("groups");
        let gArr = group.split(',');
        let name = "C0003:";
        let value = "1"; // default will be Accept/ON
        gArr.forEach(val => {
            if (val.indexOf(name) == 0) 
            {
                value = val.substring(name.length);
            }
        })
        console.log(value)
        if(value == "0") // 0: OFF - 1: ON
        {
            console.log("DECLINE COOKIE")
            window.localStorage.clear(); // delete all saves
            this.SaveUserID(this.m_uuid); // save again UUID for Tracking (onlly UUID is saving)
            this.acceptCookie = false;
        }
        else
        {
            console.log("ACCEPT COOKIE")
        }
        console.log("============ COOKIES ============")

        // SessionID
        this.m_session_id = this.LoadSessionsID();
        if(this.m_session_id != null)
        {
            this.m_session_id++;
            console.log("session_id = " + this.m_session_id)
            this.SaveSessionsID(this.m_session_id);
        }
        else
        {
            this.m_session_id = 1;
            console.log("session_id = 1")
            this.SaveSessionsID(1);
        }
        // this.m_os = this.GetOS();
        this.m_os = window.d_os;
        window.token = 1;
        // this.m_token  = window.token;

        // Time Session
        var timeOldSession = this.LoadTimeOldSession()
        var currentTime = (new Date).getTime();
        this.SaveTimeCurrentSession(currentTime);
        if(timeOldSession != null)
        {
            this.time_between_session = (currentTime - timeOldSession) / 1000;
        }
        console.log("time_between_session = " + this.time_between_session)

        await this.GetCountryId();
        this.onDetectInfoFromUrl();

        console.log("==============================");
        console.log("cmsPhase    = " + cmsPhase);
        console.log("omsVersion  = " + omsVersion);
        console.log("ggi         = " + ggi);
        console.log("apiUrl      = " + apiUrl);
        // console.log("campaign_id = " + campaign_id);
        // console.log("creative_id = " + creative_id);

        console.log("uuid        = " + uuid);
        console.log("session_id  = " + session_id);
        // console.log("visit_id    = " + visit_id);
        console.log("ip_country  = " + window.country);
        console.log("os  = " + this.m_os);
        // console.log("mgp_code    = " + mgp_code);
        // console.log("ident_id    = " + ident_id);
        console.log("game_name   = " + game_name);
        console.log("==============================");

        if (
            game_name != "undefined" &&
            game_name != null &&
            game_name != ""
        ) {
            mTracking.Send_QR_ACTION();
        }
        mTracking.Send_LAUNCH_RESUME();
    }

    GetCookies(cName) 
    {
        let name = cName + "=";
        // let temp = "OptanonConsent=isIABGlobal=false&datesta92-f5c8083afb52&interactionCount=2&landingPath=NotLandingPage&groups=C0001:1,C0003:0&hosts=H41:1&geolocation=;&AwaitingReconsent=false; OptanonAlertBoxClosed=2021-12-03T07:14:17.991Z"
        // let temp = "";
        // let cDecoded = decodeURIComponent(temp); //to be careful
        let cDecoded = decodeURIComponent(document.cookie); //to be careful
        let cArr = cDecoded.split('&');
        let res = "";
        cArr.forEach(val => {
            if (val.indexOf(name) == 0) 
            {
                res = val.substring(name.length);
            }
        })
        return res;
    }

    onDetectInfoFromUrl() 
    {
        // #dataBase64 = "visit_id"/"country_code", visit_id = "mgp_code"-"timestamp"-"random number"
        // let url = "https://applaydu.kinder.com/xmas/krc2021/creative/QzIyX0NSRTEtQ0Ex#MzZaNDlMSy0xNjM3MTI1ODExLTQ0MzE4ODYzOTgvVk4=";
        let url = document.URL;
        console.log('document.URL ', url);

        if(url.indexOf("#") != -1)
        {
            let dataParser = url.split("#");
            let dataBase64 = dataParser[dataParser.length - 1];
            let decodeBase64 = atob(dataBase64);
            this.m_visit_id = decodeBase64.split("/")[0];
            // this.m_ip_country = decodeBase64.split("/")[1];
            this.m_mgp_code = this.m_ident_id = this.m_visit_id.split("-")[0];
            this.m_pack_name = this.GetPackageName(this.m_mgp_code.toLowerCase());
            console.log("========== " + url)
            console.log("========== " + dataBase64)
            console.log("========== " + decodeBase64)
        }
    }

    FormatNum(num, min = 4)
    {
        var numString = num.toString(16);
        return `${'0'.repeat(min - numString.length)}${numString}`;
    }

    RandInRange(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    GetUDID() {
        var udid = `${this.FormatNum(
            this.RandInRange(0, 0xffff)
        )}${this.FormatNum(this.RandInRange(0, 0xffff))}-${this.FormatNum(
            this.RandInRange(0, 0xffff)
        )}-${this.FormatNum(
            this.RandInRange(0, 0xffff) | 0x4000
        )}-${this.FormatNum(
            this.RandInRange(0, 0xffff) | 0x8000
        )}-${this.FormatNum(this.RandInRange(0, 0xffff))}${this.FormatNum(
            this.RandInRange(0, 0xffff)
        )}${this.FormatNum(this.RandInRange(0, 0xffff))}`;
        return udid.replace(/[\t\n\r]/gm, "").trim();
    }

    LoadUserID() 
    {
        try {
            var userid = JSON.parse(window.localStorage.getItem("uuid"));
            if (userid != null) {
                return userid;
            }
            return null;
        } catch {}
    }

    SaveUserID(id) 
    {
        // if(this.acceptCookie)
        {
            window.localStorage.setItem("uuid", JSON.stringify(id));
        }
    }

    LoadSessionsID() 
    {
        try {
            var sesid = JSON.parse(window.localStorage.getItem("sessionsID"));
            if (sesid != null) {
                return sesid;
            }
            return null;
        } catch {}
    }
    
    SaveSessionsID(id) 
    {
        if(this.acceptCookie)
        {
            window.localStorage.setItem("sessionsID", JSON.stringify(id));
        }
    }

    LoadTimeOldSession() {
        try {
            let timeSes = JSON.parse(
                window.localStorage.getItem("timeSession")
            );
            if (timeSes != null) {
                return timeSes;
            }
            return null;
        } catch {}
    }

    SaveTimeCurrentSession(id) 
    {
        if(this.acceptCookie)
        {
            window.localStorage.setItem("timeSession", JSON.stringify(id));
        }
    }

    GetOS() {
        var userAgent = window.navigator.userAgent,
            platform = window.navigator.platform,
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'],
            os = null;
        
        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'Mac OS';
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        } else if (/Android/.test(userAgent)) {
            os = 'Android';
        } else if (!os && /Linux/.test(platform)) {
            os = 'Linux';
        }
        
        return os;
    }

    GetCmsPhase()
    {
        return this.m_cmsPhase;
    }

    GetOmsVersion()
    {
        return this.m_omsVersion;
    }

    GetGGI()
    {
        if(this.m_cmsPhase == "BETA")
        {
            return this.m_ggi_BETA;
        }
        else
        {
            return this.m_ggi_GOLD;
        }
    }

    GetApiUrl()
    {
        if(this.m_cmsPhase == "BETA")
        {
            return this.apiUrl_BETA;
        }
        else
        {
            return this.apiUrl_GOLD;
        }
    }

    GetCampaignId()
    {
        if(this.m_cmsPhase == "BETA")
        {
            return this.campaign_id_BETA;
        }
        else
        {
            return this.campaign_id_GOLD;
        }
    }

    GetCreativeId()
    {
        if(this.m_cmsPhase == "BETA")
        {
            return this.creative_id_BETA;
        }
        else
        {
            return this.creative_id_GOLD;
        }
    }

    GetCountryId() {
        return new Promise((resolve) => {
            let url = 'https://test.alpha.g4b.gameloft.com/country-code';

            this.getJSON(url, function(err, data) {
                if (err !== null) {
                    console.log('Error getting ip_c: ' + err);
                    window.country = '';
                  } else {
                    if(data){
                        console.log('ip_c result: ' + data.countryCode);
                        window.country = data.countryCode;
                    }
                }
                resolve(true);
            }, this);
          });
    }

    getJSON(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
          var status = xhr.status;
          if (status === 200) {
            callback(null, xhr.response);
          } else {
            callback(status, xhr.response);
          }
        };
        xhr.send();
    }

    Send_LAUNCH_RESUME()
    {
        this.SendEventTracking(this.LAUNCH_RESUME);
    }

    Send_QR_ACTION()
    {
        this.SendEventTracking(this.QR_ACTION);
    }

    SendEventTracking(action)
	{
        console.log("TrackingFormat = " + (action == this.LAUNCH_RESUME ? "LAUNCH_RESUME" : "QR_ACTION"))

        this.trackdata = {
			ggi: this.GetGGI(),
			entity_type: this.m_cmsPhase == "GOLD" ? "GAMELOFT_MINIGAME_GOLD" : "GAMELOFT_MINIGAME_BETA",
			entity_id: `3402:${this.GetGGI()}:${this.m_omsVersion}:HTML5:Ads`,
			proto_ver: `${this.m_omsVersion}`,
			ts: 0,
            uuid: '',
            events: []
        };

        switch(action) {
            case this.LAUNCH_RESUME:
                this.trackdata.events.push({
                    gdid: 0,
                    type: this.LAUNCH_RESUME,
                    token: window.token++,
                    data: {
                        anon_id: decodeURIComponent(this.m_uuid) || "N/A",
                        account_id: "N/A",
                        pack_name: this.m_pack_name || "direct_url",
                        ses_id: this.LoadSessionsID(),
                        ses_t: 0,
                        d_browser: window.UAbrowsername || window.browserName || "N/A",
                        ip_country: window.country || "N/A",
                        // d_os: sys.os || "N/A",
                        d_os: this.m_os || "N/A",
                        d_manufacturer: window.UAdevicevendor || window.manufacturer || "N/A",
                        d_name: window.UAdevicemodel || "N/A",
                        d_firmware: window.USosVersion || sys.osVersion || "N/A",
                        //
                        launch_source: this.m_launch_source,
                        time_between_session: Math.ceil(this.time_between_session || 0),
                        time_spent: 0,
                    }
                });
                break;
            case this.QR_ACTION:
                this.trackdata.events.push({
                    gdid: 0,
                    type: this.QR_ACTION,
                    token: window.token++,
                    data: {
                        anon_id: decodeURIComponent(this.m_uuid) || "N/A",
                        account_id: "N/A",
                        pack_name: this.m_pack_name || "direct_url",
                        ses_id: this.LoadSessionsID(),
                        ses_t: 0,
                        d_browser: window.UAbrowsername || window.browserName || "N/A",
                        ip_country: window.country || "N/A",
                        // d_os: sys.os || "N/A",
                        d_os: this.m_os || "N/A",
                        d_manufacturer: window.UAdevicevendor || window.manufacturer || "N/A",
                        d_name: window.UAdevicemodel || "N/A",
                        d_firmware: window.USosVersion || sys.osVersion || "N/A",
                        //
                        reference: this.m_pack_name,
                        result: 425994, // SUCCESS
                        time_spent: 0,
                    }
                });
                break;
            
        }



        if(this.m_cmsPhase == "BETA")
        {
            this.trackdata.events.forEach((event) =>
            {
                event["anon_id"] = decodeURIComponent(this.m_uuid) || "";
            });
        }
        if (this.trackdata.events.length > 0)
        {
            let time = Math.floor(Date.now() / 1000);
            this.trackdata["ts"] = time + (new Date().getTimezoneOffset() * 60);
            this.trackdata["uuid"] = this.GetUDID();
            this.trackdata.events.forEach((event) =>
            {
                let evdata = event["data"];

                event["ts"] = time;
                // evdata["campaign_id"] = "parseInt(evdata["campaign_id"])";
                // evdata["creative_id"] = parseInt(evdata["creative_id"]);
                // evdata["campaign_id"] = "N/A";
                // evdata["creative_id"] = "N/A";

                // if (evdata["d_country"] == "")
                // {
                //     evdata["d_country"] = "N/A";
                // }

                if (evdata["ip_country"] == "")
                {
                    evdata["ip_country"] = "N/A";
                }
            });

            // var crypto = require('crypto');
            // var hashedPayload = crypto.createHash(JSON.stringify(trackdata));
            let hashedPayload = this.SHA1(JSON.stringify(this.trackdata));
            let params = `?x-ets-ggi=${this.GetGGI()}&x-ets-sha1=${hashedPayload}`;
            let url = this.GetApiUrl() + params;

            console.log("========== Tracking URL = " + url)
            console.log("========== TrackData = " + JSON.stringify(this.trackdata, null, 2))

            let http = this.SendPayload(url, "", this.trackdata, "", false);
            // return http;
        }
    }

    SendPayload(url, actions, payload, callback, isRetry)
    {
        let http = new XMLHttpRequest();
        if (!isRetry)
        {
            http.onload = (e) =>
            {
                if (callback)
                {
                    callback(true);
                    callback = null;
                }
            };

            http.onerror = (e) =>
            {
                if (callback)
                {
                    callback(false);
                    callback = null;
                }
                this.SendPayload(url, actions, payload, callback, true);
            };
        }

        // timeout callback : 2s
        if (callback)
        {
            setTimeout(() =>
            {
                if (callback)
                {
                    callback(false);
                    callback = null;
                }
            }, 2000);
        }

        http.open("POST", url, true);
        http.setRequestHeader("Content-type", "application/json");
        http.send(JSON.stringify(payload));

        return http;
    }

    GetPackageName(code)
    {
        if(code.includes("T1"))
        {
            return "T1";
            return "std-t4-flowpack";
        } 
        else if(code.includes("T2"))
        {
            return "T2";
            return "std-t4-flowpack";
        } 
        else if(code.includes("T4"))
        {
            return "T4";
            return "std-t4-flowpack";
        }
        else if(code.includes("T6"))
        {
            return "T6";
            return "std-t6-flowpack";
        }
        else if(code.includes("T10"))
        {
            return "T10";
            return "std-t10-mastello";
        }
        else if(code.includes("T10TM"))
        {
            return "T10TM";
            return "std-t10-mastello-travelmkt";
        }
        else if(code.includes("T10DM"))
        {
            return "T10DM";
            return "d&m-t10-mastello";
        }
        else if(code.includes("T11"))
        {
            return "T11";
            return "std-t11-mastello";
        }
        else if(code.includes("T18"))
        {
            return "T18";
            return "std-t18-mastello";
        }
        else if(code.includes("T18DM"))
        {
            return "T18DM";
            return "d&m-t18-mastello";
        }
        else if (code.includes("T18TM"))
        {
            return "T18TM";
            return "std-t18-crd-travelmkt";
        } 
        else if (code.includes("T20"))
        {
            return "T20";
            return "std-t20-mastello";
        }
        else if (code.includes("T11X2PR"))
        {
            return "T11X2PR";
            return "std-t20-mastello";
        }
        else if (code.includes("T20PR"))
        {
            return "T20PR";
            return "std-t20-mastello";
        }
        else if (code.includes("T11PR"))
        {
            return "T11PR";
            return "std-t20-mastello";
        }
        else if (code.includes("KM001"))
        {
            return 'KM001';
        }

        return 'direct_url';
        return 'N/A';
    }

    SHA1 (msg) 
    {
        function rotate_left(n,s) 
        {
            var t4 = ( n<<s ) | (n>>>(32-s));
            return t4;
        };
        
        function lsb_hex(val) 
        {
            var str="";
            var i;
            var vh;
            var vl;
            for( i=0; i<=6; i+=2 ) 
            {
                vh = (val>>>(i*4+4))&0x0f;
                vl = (val>>>(i*4))&0x0f;
                str += vh.toString(16) + vl.toString(16);
            }
            return str;
        };

        function cvt_hex(val) 
        {
            var str="";
            var i;
            var v;
            for( i=7; i>=0; i-- ) 
            {
                v = (val>>>(i*4))&0x0f;
                str += v.toString(16);
            }
            return str;
        };
    
        function Utf8Encode(string) 
        {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) 
            {
                var c = string.charCodeAt(n);
                if (c < 128) 
                {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) 
                {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else 
                {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        };
        
        var blockstart;
        var i, j;
        var W = new Array(80);
        var H0 = 0x67452301;
        var H1 = 0xEFCDAB89;
        var H2 = 0x98BADCFE;
        var H3 = 0x10325476;
        var H4 = 0xC3D2E1F0;
        var A, B, C, D, E;
        var temp;

        msg = Utf8Encode(msg);

        var msg_len = msg.length;
        var word_array = new Array();

        for( i=0; i<msg_len-3; i+=4 ) 
        {
            j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 | msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
            word_array.push( j );
        }
        
        switch( msg_len % 4 ) 
        {
            case 0:
                i = 0x080000000;
            break;

            case 1:
                i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
            break;
    
            case 2:
                i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
            break;

            case 3:
                i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8    | 0x80;
            break;
        }

        word_array.push( i );
        while( (word_array.length % 16) != 14 ) word_array.push( 0 );
        word_array.push( msg_len>>>29 );
        word_array.push( (msg_len<<3)&0x0ffffffff );

        for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) 
        {
            for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
            for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);

            A = H0;
            B = H1;
            C = H2;
            D = H3;
            E = H4;
            
            for( i= 0; i<=19; i++ ) 
            {
                temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B,30);
                B = A;
                A = temp;
            }

            for( i=20; i<=39; i++ ) 
            {
                temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B,30);
                B = A;
                A = temp;
            }
            
            for( i=40; i<=59; i++ ) 
            {
                temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B,30);
                B = A;
                A = temp;
            }

            for( i=60; i<=79; i++ ) 
            {
    
                temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B,30);
                B = A;
                A = temp;
            }

            H0 = (H0 + A) & 0x0ffffffff;
            H1 = (H1 + B) & 0x0ffffffff;
            H2 = (H2 + C) & 0x0ffffffff;
            H3 = (H3 + D) & 0x0ffffffff;
            H4 = (H4 + E) & 0x0ffffffff;
        }

        var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
        return temp.toLowerCase();
    }
}
