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

import com.google.gson.Gson;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Scanner;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that  */
@WebServlet("/get-covidTampsData")
public class CovidTampsDataServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    LinkedHashMap<String, LinkedHashMap<String, Integer>> covidData = 
        new LinkedHashMap<String, LinkedHashMap<String, Integer>>();
    
    covidData.put("covidBySex", getDataFromCsv("/WEB-INF/confirmedCovidTampsBySex.csv"));
    covidData.put("covidByMunicipality", getDataFromCsv("/WEB-INF/confirmedCovidTampsByMunicipality.csv"));
    covidData.put("covidByAgeRange", getDataFromCsv("/WEB-INF/confirmedCovidTampsByAgeRange.csv"));

    response.setContentType("application/json");
    Gson gson = new Gson();
    String json = gson.toJson(covidData);
    response.getWriter().println(json);
  }

  /**
   *
   */
  private LinkedHashMap<String, Integer> getDataFromCsv(String path) {
    LinkedHashMap<String, Integer> data = new LinkedHashMap<String, Integer>();
    
    Scanner scanner = new Scanner(getServletContext().getResourceAsStream(path));
    while (scanner.hasNextLine()) {
      String line = scanner.nextLine();
      String[] cells = line.split(",");

      String attribute = cells[0];
      Integer value = Integer.parseInt(cells[1]);

      data.put(attribute, value);
    }
    scanner.close();

    return data;
  }

  // /**
  //  * Converts a list into a JSON string using the Gson library.
  //  */
  // private String convertListToJson(List list) {
  //   Gson gson = new Gson();
  //   return gson.toJson(list);
  // }
}
