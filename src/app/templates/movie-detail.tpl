<%
if(typeof backdrop === "undefined"){ backdrop = ""; };
if(typeof synopsis === "undefined"){ synopsis = "Synopsis not available."; };
if(typeof runtime === "undefined"){ runtime = "N/A"; };
if (genre) {
    for(var i = 0; i < genre.length; i++) {
        genre[i] = i18n.__(genre[i]);
    }
} else {
    var genre = [undefined];
};
%>

<div data-bgr="<%= backdrop %>" class="backdrop"></div>
<div class="backdrop-overlay"></div>

<div class="fa fa-times close-icon"></div>

<section class="poster-box">
    <img src="images/posterholder.png" data-cover="<%= cover %>" class="mcover-image" />
</section>

<section class="content-box">

    <div class="meta-container">
        <div class="title"><%= title %></div>

        <div class="metadatas">
            <div class="metaitem">Episode - <%= episode %></div>
            <div class="dot"></div>
            <div class="metaitem"><%= runtime %> min</div>
            <div class="dot"></div>
            <div class="metaitem"><%= genre.join(" / ") %></div>
            <!--div data-toggle="tooltip" data-placement="left" title="<%=i18n.__("Health false") %>" class="fa fa-circle health-icon <%= health %>"></div-->
            <div data-toogle="tooltip" data-placement="left" title="<%=i18n.__("Magnet link") %>" class="fa fa-magnet magnet-link"></div>

        </div>

        <div class="overview"><%= synopsis %></div>
    </div>

    <div class="bottom-container">

        <!--div class="favourites-toggle"><%=i18n.__("Add to bookmarks") %></div-->
        <!--div class="watched-toggle"><%=i18n.__("Not Seen") %></div-->
        <br>

        <div class="button dropup" id="player-chooser"></div>
        <div id="watch-trailer" class="button"><%=i18n.__("Watch Trailer") %></div>

        <div class="movie-quality-container">
           <% if (torrents["720p"] !== undefined && torrents["1080p"] !== undefined) { %>
                <div class="q720">720p</div>
                <div class="q1080">1080p</div>
                <div class="quality switch white">
                    <input type="radio" name="switch" id="switch-hd-off" >
                    <input type="radio" name="switch" id="switch-hd-on" checked >
                    <span class="toggle"></span>
                </div>
            <% } else { %>
                <% if (torrents["720p"] !== undefined) { %>
                    <div class="q720">720p</div>
                <% }else if (torrents["1080p"] !== undefined) { %>
                    <div class="q720">1080p</div>
                <% } else { %>HDRip<% } %>
            <% } %>
        </div>

    </div>
</section>
