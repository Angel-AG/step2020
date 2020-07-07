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
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.gson.Gson;
import com.google.sps.data.Comment;
import com.google.sps.data.HttpServletUtils;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns a list of comments */
@WebServlet("/get-comments")
public class ListCommentsServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Handle GET parameters
    String commentPicId = HttpServletUtils.getParameter(request, "imageId", "");
    int fetchQuantity = Integer.parseInt(HttpServletUtils.getParameter(request, "quantity", "5"));
    boolean isDateDescending = Boolean.parseBoolean(
        HttpServletUtils.getParameter(request, "dateDescending", "false"));

    // A pic id is needed to continue
    if (commentPicId.isEmpty()) {
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }

    Query fetchComments = buildQuery(commentPicId, isDateDescending);

    Iterable<Entity> commentsRetrieved = retrieveComments(fetchComments, fetchQuantity);

    List<Comment> comments = createCommentsList(commentsRetrieved);

    response.setContentType("application/json;");
    response.getWriter().println(convertListToJson(comments));
  }

  /**
   * Construct a query according to the parameters' values
   */
  private Query buildQuery(String commentPicId, boolean isDateDescending) {
    Query query = new Query("Comment");
    
    // Sort by date
    query.addSort("date", isDateDescending ? SortDirection.DESCENDING : SortDirection.ASCENDING);

    // Filter comments by pic id
    query.addFilter("imageId", FilterOperator.EQUAL, commentPicId);

    return query;
  }

  /**
   * Return the results of a query with a limit
   */
  private Iterable<Entity> retrieveComments(Query fetchComments, int quantity) {
    if (quantity < 0) {
      quantity = 0;
    } else if (quantity > 20) {
      quantity = 20;
    }

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    return datastore.prepare(fetchComments).asIterable(FetchOptions.Builder.withLimit(quantity));
  }

  /**
   * Return a List with comments retrieved by a query
   */
  private List<Comment> createCommentsList(Iterable<Entity> commentsRetrieved) {
    List<Comment> comments = new ArrayList<>();
    for (Entity commentEntity : commentsRetrieved) {
      long id = commentEntity.getKey().getId();
      String username = (String) commentEntity.getProperty("username");
      String comment = (String) commentEntity.getProperty("comment");
      String imageId = (String) commentEntity.getProperty("imageId");
      Date date = (Date) commentEntity.getProperty("date");

      comments.add(new Comment(id, username, comment, imageId, date));
    }

    return comments;
  }

  /**
   * Converts a list into a JSON string using the Gson library.
   */
  private String convertListToJson(List list) {
    Gson gson = new Gson();
    return gson.toJson(list);
  }
}
