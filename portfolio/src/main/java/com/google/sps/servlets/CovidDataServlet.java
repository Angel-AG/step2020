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
import com.google.sps.data.BadDataException;
import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Scanner;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that retrieves data from csv files*/
@WebServlet("/get-covidData")
public class CovidDataServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Map<String, LinkedHashMap<String, Integer>> covidData = 
        new HashMap<String, LinkedHashMap<String, Integer>>();
    
    try {
      covidData.put("covidBySex", getDataFromCsv("/WEB-INF/confirmedCovidTampsBySex.csv"));
      covidData.put("covidByMunicipality", getDataFromCsv("/WEB-INF/confirmedCovidTampsByMunicipality.csv"));
      covidData.put("covidByAgeRange", getDataFromCsv("/WEB-INF/confirmedCovidTampsByAgeRange.csv"));
      covidData.put("deathsByState", getDataFromCsv("/WEB-INF/deathsCovidMxByState.csv"));
    } catch (Exception ex) {
      System.out.println(ex);
      response.sendError(500);
    }

    response.setContentType("application/json");
    Gson gson = new Gson();
    String data = gson.toJson(covidData);
    response.getWriter().println(data);
  }

  /**
   * Get data from a csv file.
   * The structure of the csv needs to be "attribute,value", without headers.
   */
  private LinkedHashMap<String, Integer> getDataFromCsv(String path) throws BadDataException {
    LinkedHashMap<String, Integer> data = new LinkedHashMap<String, Integer>();
    
    Scanner scanner = new Scanner(getServletContext().getResourceAsStream(path));
    while (scanner.hasNextLine()) {
      String line = scanner.nextLine();
      String[] cells = line.split(",");

      if (cells.length != 2) {
        throw new BadDataException("Wrong structure of csv. Needs to be 'String,number'");
      }

      String attribute = cells[0];
      Integer value = Integer.parseInt(cells[1]);

      data.put(attribute, value);
    }
    scanner.close();

    if (data.isEmpty()) {
      throw new BadDataException("The csv file was empty");
    }

    return data;
  }
}
