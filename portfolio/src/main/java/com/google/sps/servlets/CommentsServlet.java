// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.gson.Gson;
import com.google.sps.data.Comment;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that handles comments data */
@WebServlet("/comments")
public class CommentsServlet extends HttpServlet {

  private int fetchQuantity;

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String quantity = getParameter(request, "quantity", "");
    if (quantity.isEmpty()) {
      fetchQuantity = 5;
    } else {
      fetchQuantity = Integer.parseInt(quantity);
    }

    Query fetchComments = new Query("Comment").addSort("date", SortDirection.DESCENDING);

    Iterable<Entity> commentsRetrieved = retrieveComments(fetchComments, fetchQuantity);

    List<Comment> comments = new ArrayList<>();
    for (Entity commentEntity : commentsRetrieved) {
      long id = commentEntity.getKey().getId();
      String username = (String) commentEntity.getProperty("username");
      String comment = (String) commentEntity.getProperty("comment");
      Date date = (Date) commentEntity.getProperty("date");

      comments.add(new Comment(id, username, comment, date));
    }

    response.setContentType("application/json;");
    response.getWriter().println(convertListToJson(comments));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String username = getParameter(request, "username", "Anonymous");
    String comment = getParameter(request, "comment", "");
    Date date = new Date();

    if (comment.isEmpty()) {
      // TODO: Create error feedback for client
      response.sendRedirect("/gallery.html");
      return;
    }

    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("username", username);
    commentEntity.setProperty("comment", comment);
    commentEntity.setProperty("date", date);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEntity);    

    response.sendRedirect("/gallery.html");
  }

  /**
   * Converts a list into a JSON string using the Gson library.
   */
  private String convertListToJson(List list) {
    Gson gson = new Gson();
    return gson.toJson(list);
  }

  /**
   * Return the request parameter or the default value if the parameter
   * was not specified by the client
   */
  private String getParameter(HttpServletRequest request, String name, String defaultValue) {
    String value = request.getParameter(name);
    if (value == null || value.isEmpty()) {
      return defaultValue;
    }
    return value;
  }

  /**
   * Return the results of a query with a limit
   */
  private Iterable<Entity> retrieveComments(Query fetchComments, int quantity) {
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    return datastore.prepare(fetchComments).asIterable(FetchOptions.Builder.withLimit(quantity));
  }
}
