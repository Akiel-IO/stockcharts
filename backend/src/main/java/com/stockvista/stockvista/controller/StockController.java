package com.stockvista.stockvista.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    @Value("${polygon.api.key}")
    private String apiKey;

    private final String BASE_URL = "https://api.polygon.io/v2/aggs/ticker/";

    @GetMapping("/{symbol}")
    public ResponseEntity<String> getStockData(@PathVariable String symbol) {
        String url = BASE_URL + symbol + "/range/1/day/2023-01-01/2024-07-16?apiKey=" + apiKey;
        RestTemplate restTemplate = new RestTemplate();
        String result = restTemplate.getForObject(url, String.class);
        return ResponseEntity.ok(result);
    }
}
