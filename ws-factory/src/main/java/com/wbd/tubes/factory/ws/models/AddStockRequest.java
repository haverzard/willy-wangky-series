package com.wbd.tubes.factory.ws.models;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlElement;

@XmlRootElement
public class AddStockRequest {

    @XmlElement
    public int id;
    @XmlElement
    public int chocolateId;
    @XmlElement
    public String chocolateName;
    @XmlElement
    public int amountToAdd;
    @XmlElement
    public String status;

    public AddStockRequest() {}

    public AddStockRequest(int id, int chocolateId, String chocolateName, int amountToAdd, String status) {
        this.id = id;
        this.chocolateId = chocolateId;
        this.chocolateName = chocolateName;
        this.amountToAdd = amountToAdd;
        this.status = status;
    }

    public int getId() {
        return id;
    }

    public int getChocolateId() {
        return id;
    }

    public String getChocolateName() {
        return chocolateName;
    }

    public int getAmountToAdd() {
        return amountToAdd;
    }

    public String getStatus() {
        return status;
    }
}
