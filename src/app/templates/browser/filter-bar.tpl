<ul class="nav nav-hor left">
    <% _.each (App.Config.getTabTypes(), function (tab) { %>
    <li class="source <%= tab.type %>TabShow providerinfo" data-toggle="tooltip" data-placement="top" title="<%= tab.tooltip %>"><%= tab.name %></li>
    <% }); %>
</ul>
<!--ul id="nav-filters" class="nav nav-hor filters">
    <% if(typeof type !== 'undefined'){ %>
        <li class="dropdown filter types">
            <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                <%= i18n.__("Type") %>
                    <span class="value" data-value="<%= type %>"><%= i18n.__(type) %></span>
                    <span class="caret"></span>
            </a>
            <ul class="dropdown-menu">
                <% _.each(types, function(c) { %>
                    <li><a href="#" data-value="<%= c %>"><%= i18n.__(c) %></a></li>
                <% }); %>
            </ul>
        </li>

    <% }if(typeof genre !== 'undefined'){ %>
        <li class="dropdown filter genres">
            <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                <%= i18n.__("Genre") %>
                    <span data-value="<%= genre %>" class="value"><%= i18n.__(genre.capitalizeEach()) %></span>
                    <span class="caret"></span>
            </a>
            <ul class="dropdown-menu">
                <% _.each(genres, function(c) { %>
                    <li><a href="#" data-value="<%= c %>"><%= i18n.__(c.capitalizeEach()) %></a></li>
                <% }); %>
            </ul>
        </li>
    <%} if(typeof sorter !== 'undefined'){ %>
        <li class="dropdown filter sorters">
            <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                <%= i18n.__("Sort by") %>
                    <span data-value="<%= sorter %>" class="value"><%= i18n.__(sorter.capitalizeEach()) %></span>
                    <span class="caret"></span>
            </a>
            <ul class="dropdown-menu">
                <% _.each(sorters, function(c) { %>
                    <li><a href="#" data-value="<%= c %>"><%= i18n.__(c.capitalizeEach()) %></a></li>
                <% }); %>
            </ul>
        </li>
    <%}%>
</ul-->
<!--ul class="nav nav-hor right">
    <li>
        <div class="right search">
            <form>
                <input id="searchbox" type="text" placeholder="<%= i18n.__("Search") %>">
                <div class="clear fa fa-times"></div>
            </form>
        </div>
    </li>

    <li>
        <i id="filterbar-settings" class="fa fa-cog settings tooltipped" data-toggle="tooltip" data-placement="left" title="<%= i18n.__("Settings") %>"></i>
    </li>
</ul-->
